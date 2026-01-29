import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";

export const runtime = "nodejs"; // Stripe needs Node runtime

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });

  let event: Stripe.Event;

  try {
    const body = await req.text(); // MUST be raw body for signature verification
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err?.message || err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ✅ Checkout completed (Payment Link / Checkout one-time OR subscription)
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const email =
          session.customer_details?.email ||
          session.customer_email ||
          undefined;

        const customerId = typeof session.customer === "string" ? session.customer : undefined;
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : undefined;

        if (!email) break;

        const isSubscription = !!subscriptionId;

        // One-time purchase: set premiumUntil far out (or remove and just keep isPremium true)
        const premiumUntil = isSubscription
          ? undefined
          : new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000); // ~10 years

        await db.user.upsert({
          where: { email },
          update: {
            isPremium: true,
            stripeCustomerId: customerId ?? undefined,
            stripeSubscriptionId: subscriptionId ?? undefined,
            premiumUntil,
          },
          create: {
            email,
            isPremium: true,
            stripeCustomerId: customerId ?? undefined,
            stripeSubscriptionId: subscriptionId ?? undefined,
            premiumUntil,
          },
        });

        break;
      }

      // ✅ Subscription renewal/payment succeeded
      case "invoice.payment_succeeded": {
        // Stripe typings can be strict here, so safely read from any:
        const obj = event.data.object as any;

        const customerId =
          typeof obj.customer === "string"
            ? (obj.customer as string)
            : typeof obj.customer?.id === "string"
              ? (obj.customer.id as string)
              : undefined;

        const subscriptionId =
          typeof obj.subscription === "string"
            ? (obj.subscription as string)
            : typeof obj.subscription?.id === "string"
              ? (obj.subscription.id as string)
              : undefined;

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

      // ✅ Subscription cancelled -> turn off premium
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
                premiumUntil: null,
              },
            });
          }
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
