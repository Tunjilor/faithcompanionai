import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing webhook signature/secret" }, { status: 400 });
  }

  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    // Checkout finished (subscription OR one-time)
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const email = session.customer_details?.email || session.customer_email;
      const customerId = typeof session.customer === "string" ? session.customer : null;

      if (!email) break;

      // If subscription, webhook will also get subscription.created/updated
      // For one-time lifetime, you can treat paid checkout as premium forever:
      const paid = session.payment_status === "paid";
      if (!paid) break;

      await db.user.upsert({
        where: { email },
        update: {
          stripeCustomerId: customerId || undefined,
          isPremium: true,
          premiumUntil: null, // treat as forever unless later you want it plan-based
        },
        create: {
          email,
          stripeCustomerId: customerId || undefined,
          isPremium: true,
          premiumUntil: null,
        },
      });

      break;
    }

    // Subscription lifecycle
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as any;
      const customerId = sub.customer as string;
      const status = sub.status as string;

      // active/trialing => premium
      const premium = status === "active" || status === "trialing";
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null;

      await db.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          isPremium: premium,
          premiumUntil: premium ? periodEnd : new Date(Date.now() - 1000),
        },
      });

      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      const customerId = sub.customer as string;

      await db.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          isPremium: false,
          premiumUntil: new Date(Date.now() - 1000),
        },
      });
      break;
    }

    // Payment failed => (optional) downgrade immediately or keep until period end
    case "invoice.payment_failed": {
      const invoice = event.data.object as any;
      const customerId = invoice.customer as string;

      // Conservative approach: do nothing here; subscription.updated will reflect status.
      // If you want immediate lock, uncomment below:
      /*
      await db.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { isPremium: false, premiumUntil: new Date(Date.now() - 1000) },
      });
      */
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
