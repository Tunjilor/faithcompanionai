import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const runtime = "nodejs"; // ensure Node runtime (needed for Stripe + raw body)

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });

  let event: Stripe.Event;

  try {
    const body = await req.text(); // IMPORTANT: raw body
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err?.message || err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ✅ Payment Links + Checkout (one-time OR subscription) will often hit this
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const email =
          session.customer_details?.email ||
          session.customer_email ||
          undefined;

        const customerId = typeof session.customer === "string" ? session.customer : undefined;
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : undefined;

        if (!email) break;

        // If subscription: premium remains true while subscription is active
        // If one-time: you can set premiumUntil far out, or just set isPremium true forever.
        const isSubscription = !!subscriptionId;
        const premiumUntil = isSubscription
          ? null
          : new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000); // ~10 years (placeholder)

        await db.user.upsert({
          where: { email },
          update: {
            isPremium: true,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId ?? undefined,
            premiumUntil: premiumUntil ?? undefined,
          },
          create: {
            email,
            isPremium: true,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId ?? undefined,
            premiumUntil: premiumUntil ?? undefined,
          },
        });

        break;
      }

      // ✅ Subscription renewals succeeded (keeps premium active)
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : undefined;
        const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : undefined;

        // If you want: look up customer email and ensure premium stays on
        if (customerId) {
          const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
          const email = customer.email || undefined;

          if (email) {
            await db.user.upsert({
              where: { email },
              update: {
                isPremium: true,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId ?? undefined,
                premiumUntil: undefined, // subscriptions don't need premiumUntil
              },
              create: {
                email,
                isPremium: true,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId ?? undefined,
              },
            });
          }
        }

        break;
      }

      // ✅ Subscription cancelled (turn premium off)
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : undefined;

        if (customerId) {
          const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
          const email = customer.email || undefined;

          if (email) {
            await db.user.update({
              where: { email },
              data: {
                isPremium: false,
                stripeSubscriptionId: null,
              },
            });
          }
        }

        break;
      }

      default:
        // ignore other events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
