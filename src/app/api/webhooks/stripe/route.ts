// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { sendPremiumDowngradeEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing.");
}

const stripe = new Stripe(stripeSecretKey);

function toDate(ts?: number | null) {
  return ts ? new Date(ts * 1000) : null;
}

function normalizeEmail(email?: string | null) {
  return email?.toLowerCase().trim() || null;
}

function getStripeCurrentPeriodEnd(value: unknown): number | null {
  if (!value || typeof value !== "object") return null;
  const maybe = value as { current_period_end?: number | null };
  return typeof maybe.current_period_end === "number"
    ? maybe.current_period_end
    : null;
}

async function getCustomerEmail(customerId?: string | null) {
  if (!customerId) return null;

  const customer = await stripe.customers.retrieve(customerId);
  if ("deleted" in customer) return null;

  return normalizeEmail(customer.email);
}

async function ensureUserByEmail(opts: {
  email: string;
  customerId?: string | null;
  subscriptionId?: string | null;
  isPremium?: boolean;
  premiumUntil?: Date | null;
}) {
  return db.user.upsert({
    where: { email: opts.email },
    update: {
      stripeCustomerId: opts.customerId ?? undefined,
      stripeSubscriptionId: opts.subscriptionId ?? undefined,
      ...(typeof opts.isPremium === "boolean"
        ? { isPremium: opts.isPremium }
        : {}),
      ...(opts.premiumUntil !== undefined
        ? { premiumUntil: opts.premiumUntil }
        : {}),
    },
    create: {
      email: opts.email,
      stripeCustomerId: opts.customerId ?? undefined,
      stripeSubscriptionId: opts.subscriptionId ?? undefined,
      isPremium: opts.isPremium ?? false,
      premiumUntil: opts.premiumUntil ?? null,
    },
  });
}

async function upsertSubscriptionState(opts: {
  email?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  status?: string | null;
  currentPeriodEnd?: number | null;
  cancelAtPeriodEnd?: boolean | null;
}) {
  const email = normalizeEmail(opts.email);
  if (!email || !opts.subscriptionId) return;

  const activeStatuses = new Set(["active", "trialing"]);
  const isActive = activeStatuses.has(String(opts.status || ""));
  const premiumUntil = isActive ? toDate(opts.currentPeriodEnd) : null;

  const user = await ensureUserByEmail({
    email,
    customerId: opts.customerId || null,
    subscriptionId: opts.subscriptionId || null,
    isPremium: isActive,
    premiumUntil,
  });

  await db.subscription.upsert({
    where: {
      stripeSubscriptionId: opts.subscriptionId,
    },
    update: {
      userId: user.id,
      stripeCustomerId: opts.customerId || null,
      status: String(opts.status || "unknown"),
      currentPeriodEnd: premiumUntil,
      cancelAtPeriodEnd: Boolean(opts.cancelAtPeriodEnd),
    },
    create: {
      userId: user.id,
      stripeSubscriptionId: opts.subscriptionId,
      stripeCustomerId: opts.customerId || null,
      status: String(opts.status || "unknown"),
      currentPeriodEnd: premiumUntil,
      cancelAtPeriodEnd: Boolean(opts.cancelAtPeriodEnd),
    },
  });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const email = normalizeEmail(
    session.customer_details?.email ||
      (typeof session.customer_email === "string" ? session.customer_email : null)
  );

  const customerId =
    typeof session.customer === "string" ? session.customer : null;

  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : null;

  if (!email) return;

  if (session.mode === "subscription" && subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await upsertSubscriptionState({
      email,
      customerId,
      subscriptionId,
      status: subscription.status,
      currentPeriodEnd: getStripeCurrentPeriodEnd(subscription),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

    return;
  }

  if (session.mode === "payment") {
    if (session.payment_status !== "paid") return;

    const user = await ensureUserByEmail({
      email,
      customerId,
      subscriptionId: null,
      isPremium: true,
      premiumUntil: null,
    });

    await db.subscription.upsert({
      where: {
        stripeSessionId: session.id,
      },
      update: {
        userId: user.id,
        stripeCustomerId: customerId || null,
        status: "lifetime",
        priceId:
          typeof session.metadata?.priceId === "string"
            ? session.metadata.priceId
            : null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
      create: {
        userId: user.id,
        stripeSessionId: session.id,
        stripeCustomerId: customerId || null,
        status: "lifetime",
        priceId:
          typeof session.metadata?.priceId === "string"
            ? session.metadata.priceId
            : null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
    });
  }
}

async function handleCheckoutSessionAsyncPaymentSucceeded(
  session: Stripe.Checkout.Session
) {
  await handleCheckoutSessionCompleted(session);
}

async function handleCheckoutSessionAsyncPaymentFailed(
  session: Stripe.Checkout.Session
) {
  const customerId =
    typeof session.customer === "string" ? session.customer : null;

  const email = normalizeEmail(
    session.customer_details?.email ||
      (typeof session.customer_email === "string" ? session.customer_email : null)
  );

  if (!email) return;

  await ensureUserByEmail({
    email,
    customerId,
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  const email = await getCustomerEmail(customerId);

  await upsertSubscriptionState({
    email,
    customerId,
    subscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodEnd: getStripeCurrentPeriodEnd(subscription),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  const email = await getCustomerEmail(customerId);
  if (!email) return;

  const user = await ensureUserByEmail({
    email,
    customerId,
    subscriptionId: null,
    isPremium: false,
    premiumUntil: null,
  });

  await db.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      userId: user.id,
      stripeCustomerId: customerId,
      status: subscription.status,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      status: subscription.status,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    },
  });

  // Send kind offboarding email — non-fatal if it fails
  try {
    await sendPremiumDowngradeEmail({ to: email });
  } catch (err) {
    console.error("[handleSubscriptionDeleted] downgrade email failed", email, err);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const inv = invoice as any;
  const subscriptionId =
    typeof inv.subscription === "string" ? inv.subscription : null;

  const customerId =
    typeof inv.customer === "string" ? inv.customer : null;

  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const email = await getCustomerEmail(customerId);

  await upsertSubscriptionState({
    email,
    customerId,
    subscriptionId,
    status: subscription.status,
    currentPeriodEnd: getStripeCurrentPeriodEnd(subscription),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const inv = invoice as any;
  const subscriptionId =
    typeof inv.subscription === "string" ? inv.subscription : null;

  const customerId =
    typeof inv.customer === "string" ? inv.customer : null;

  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const email = await getCustomerEmail(customerId);

  await upsertSubscriptionState({
    email,
    customerId,
    subscriptionId,
    status: subscription.status,
    currentPeriodEnd: getStripeCurrentPeriodEnd(subscription),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

export async function POST(req: Request) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is missing." },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    const alreadySeen = await db.stripeEvent.findUnique({
      where: { id: event.id },
    });

    if (alreadySeen) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "checkout.session.async_payment_succeeded":
        await handleCheckoutSessionAsyncPaymentSucceeded(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "checkout.session.async_payment_failed":
        await handleCheckoutSessionAsyncPaymentFailed(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        break;
    }

    await db.stripeEvent.create({
      data: {
        id: event.id,
        type: event.type,
      },
    });

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook error:", err);

    return NextResponse.json(
      { error: err?.message || "Webhook handler failed." },
      { status: 500 }
    );
  }
}