// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";

export const runtime = "nodejs";

const STRIPE_TOLERANCE_SECONDS = 300; // 5 min (timestamp tolerance)

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  let rawBody: string;

  try {
    // Must be raw body for signature verification
    rawBody = await req.text();

    // Signature verification + replay window (tolerance)
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
      STRIPE_TOLERANCE_SECONDS
    );
  } catch (err: any) {
    console.error("❌ Stripe webhook verification failed:", err?.message || err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ✅ Hard idempotency: dedupe Stripe event deliveries
  try {
    await db.stripeEvent.create({
      data: { id: event.id, type: event.type },
    });
  } catch (e: any) {
    // Prisma unique violation (already processed)
    if (e?.code === "P2002") {
      return NextResponse.json({ received: true, deduped: true });
    }
    console.error("❌ Failed to record Stripe event:", e);
    return NextResponse.json({ error: "Failed idempotency check" }, { status: 500 });
  }

  try {
    switch (event.type) {
      // Checkout completed (one-time OR subscription)
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const email =
          session.customer_details?.email ??
          session.customer_email ??
          undefined;

        if (!email) break;

        const customerId =
          typeof session.customer === "string" ? session.customer : undefined;

        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : undefined;

        const isSubscription = Boolean(subscriptionId);

        // One-time purchase => long premiumUntil; subscription => premiumUntil null
        const premiumUntil = isSubscription
          ? null
          : new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10); // ~10 years

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

      // Subscription renewal succeeded
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        const customerId =
          typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;

        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : (invoice.subscription as any)?.id;

        if (!customerId) break;

        const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
        const email = customer.email ?? undefined;
        if (!email) break;

        await db.user.upsert({
          where: { email },
          update: {
            isPremium: true,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId ?? undefined,
            premiumUntil: null,
          },
          create: {
            email,
            isPremium: true,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId ?? undefined,
            premiumUntil: null,
          },
        });

        break;
      }

      // Subscription cancelled
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const customerId =
          typeof sub.customer === "string" ? sub.customer : undefined;

        if (!customerId) break;

        const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
        const email = customer.email ?? undefined;
        if (!email) break;

        await db.user.update({
          where: { email },
          data: {
            isPremium: false,
            stripeSubscriptionId: null,
            premiumUntil: null,
          },
        });

        break;
      }

      default:
        // ignore other event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
