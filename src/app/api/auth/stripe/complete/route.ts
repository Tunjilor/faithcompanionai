// src/app/api/auth/stripe/complete/route.ts
import { NextResponse } from "next/server";
import {
  createSessionToken,
  defaultSessionCookieOptions,
  makeSessionExpiry,
  sessionCookieName,
} from "@/lib/session";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(req: Request) {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

function isStripeCustomer(
  c: Stripe.Customer | Stripe.DeletedCustomer
): c is Stripe.Customer {
  return !("deleted" in c);
}

function toDate(ts?: number | null) {
  return ts ? new Date(ts * 1000) : null;
}

function getStripeCurrentPeriodEnd(value: unknown): number | null {
  if (!value || typeof value !== "object") return null;
  const maybe = value as { current_period_end?: number | null };
  return typeof maybe.current_period_end === "number"
    ? maybe.current_period_end
    : null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const sessionId =
      url.searchParams.get("session_id") ||
      url.searchParams.get("checkout_session_id") ||
      "";

    if (!sessionId) {
      return NextResponse.redirect(
        new URL(
          "/pricing?status=error&message=missing_session_id",
          getBaseUrl(req)
        )
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.redirect(
        new URL(
          "/pricing?status=error&message=missing_stripe_key",
          getBaseUrl(req)
        )
      );
    }

    if (!process.env.SESSION_SECRET) {
      return NextResponse.redirect(
        new URL(
          "/pricing?status=error&message=missing_session_secret",
          getBaseUrl(req)
        )
      );
    }

    const [{ db }, { stripe }] = await Promise.all([
      import("@/lib/db"),
      import("@/lib/stripe"),
    ]);

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });

    const customerExpanded =
      checkoutSession.customer && typeof checkoutSession.customer === "object"
        ? checkoutSession.customer
        : null;

    const customerEmail =
      customerExpanded && isStripeCustomer(customerExpanded)
        ? customerExpanded.email ?? null
        : null;

    const rawEmail =
      checkoutSession.customer_details?.email ||
      checkoutSession.customer_email ||
      customerEmail ||
      null;

    const email = rawEmail?.toLowerCase().trim() || null;

    if (!email) {
      return NextResponse.redirect(
        new URL(
          "/pricing?status=error&message=missing_email",
          getBaseUrl(req)
        )
      );
    }

    const customerId =
      typeof checkoutSession.customer === "string"
        ? checkoutSession.customer
        : customerExpanded?.id ?? null;

    const expandedSubscription =
      checkoutSession.subscription &&
      typeof checkoutSession.subscription === "object"
        ? checkoutSession.subscription
        : null;

    const subscriptionId =
      typeof checkoutSession.subscription === "string"
        ? checkoutSession.subscription
        : expandedSubscription?.id ?? null;

    let shouldGrantPremium = false;
    let premiumUntil: Date | null = null;
    let subscriptionStatus: string | null = null;

    if (checkoutSession.mode === "payment") {
      shouldGrantPremium = checkoutSession.payment_status === "paid";
      premiumUntil = null;
      subscriptionStatus = shouldGrantPremium ? "lifetime" : "pending";
    }

    if (checkoutSession.mode === "subscription") {
      const sub =
        expandedSubscription ||
        (subscriptionId
          ? await stripe.subscriptions.retrieve(subscriptionId)
          : null);

      if (sub) {
        subscriptionStatus = sub.status;
        shouldGrantPremium =
          sub.status === "active" || sub.status === "trialing";
        premiumUntil = toDate(getStripeCurrentPeriodEnd(sub));
      }
    }

    const user = await db.user.upsert({
      where: { email },
      update: {
        stripeCustomerId: customerId ?? undefined,
        stripeSubscriptionId: subscriptionId ?? undefined,
        ...(shouldGrantPremium
          ? {
              isPremium: true,
              premiumUntil,
            }
          : {}),
      },
      create: {
        email,
        stripeCustomerId: customerId ?? undefined,
        stripeSubscriptionId: subscriptionId ?? undefined,
        isPremium: shouldGrantPremium,
        premiumUntil,
      },
    });

    if (checkoutSession.mode === "payment" && shouldGrantPremium) {
      await db.subscription.upsert({
        where: { stripeSessionId: checkoutSession.id },
        update: {
          userId: user.id,
          stripeCustomerId: customerId ?? null,
          status: "lifetime",
          priceId:
            typeof checkoutSession.metadata?.priceId === "string"
              ? checkoutSession.metadata.priceId
              : null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
        },
        create: {
          userId: user.id,
          stripeSessionId: checkoutSession.id,
          stripeCustomerId: customerId ?? null,
          status: "lifetime",
          priceId:
            typeof checkoutSession.metadata?.priceId === "string"
              ? checkoutSession.metadata.priceId
              : null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
        },
      });
    }

    if (checkoutSession.mode === "subscription" && subscriptionId) {
      await db.subscription.upsert({
        where: { stripeSubscriptionId: subscriptionId },
        update: {
          userId: user.id,
          stripeCustomerId: customerId ?? null,
          status: subscriptionStatus ?? "unknown",
          currentPeriodEnd: premiumUntil,
          cancelAtPeriodEnd: false,
        },
        create: {
          userId: user.id,
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId ?? null,
          status: subscriptionStatus ?? "unknown",
          currentPeriodEnd: premiumUntil,
          cancelAtPeriodEnd: false,
        },
      });
    }

    const token = createSessionToken(
      { uid: user.id, exp: makeSessionExpiry(30) },
      process.env.SESSION_SECRET
    );

    const res = NextResponse.redirect(
      new URL("/dashboard?status=success", getBaseUrl(req))
    );

    res.cookies.set(sessionCookieName(), token, defaultSessionCookieOptions());

    return res;
  } catch (err: any) {
    const msg = encodeURIComponent(err?.message || "error");
    return NextResponse.redirect(
      new URL(`/pricing?status=error&message=${msg}`, getBaseUrl(req))
    );
  }
}