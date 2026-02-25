// src/app/api/auth/stripe/complete/route.ts
import { NextResponse } from "next/server";
import { makeSessionToken, sessionCookieName } from "@/lib/session";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(req: Request) {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

// Type guard: Stripe.Customer (not DeletedCustomer)
function isStripeCustomer(
  c: Stripe.Customer | Stripe.DeletedCustomer
): c is Stripe.Customer {
  return !("deleted" in c);
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
        new URL("/pricing?status=error&message=missing_session_id", getBaseUrl(req))
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.redirect(
        new URL("/pricing?status=error&message=missing_stripe_key", getBaseUrl(req))
      );
    }

    if (!process.env.SESSION_SECRET) {
      return NextResponse.redirect(
        new URL("/pricing?status=error&message=missing_session_secret", getBaseUrl(req))
      );
    }

    const [{ db }, { stripe }] = await Promise.all([
      import("@/lib/db"),
      import("@/lib/stripe"),
    ]);

    const cs = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });

    const customerExpanded =
      cs.customer && typeof cs.customer === "object" ? cs.customer : null;

    const customerEmail =
      customerExpanded && isStripeCustomer(customerExpanded)
        ? customerExpanded.email ?? null
        : null;

    const email =
      cs.customer_details?.email ||
      cs.customer_email ||
      customerEmail ||
      null;

    if (!email) {
      return NextResponse.redirect(
        new URL("/pricing?status=error&message=missing_email", getBaseUrl(req))
      );
    }

    const customerId =
      typeof cs.customer === "string"
        ? cs.customer
        : customerExpanded?.id ?? null;

    const subscriptionExpanded =
      cs.subscription && typeof cs.subscription === "object" ? cs.subscription : null;

    const subscriptionId =
      typeof cs.subscription === "string"
        ? cs.subscription
        : subscriptionExpanded?.id ?? null;

    const user = await db.user.upsert({
      where: { email },
      update: {
        stripeCustomerId: customerId ?? undefined,
        stripeSubscriptionId: subscriptionId ?? undefined,
        isPremium: true,
      },
      create: {
        email,
        stripeCustomerId: customerId ?? undefined,
        stripeSubscriptionId: subscriptionId ?? undefined,
        isPremium: true,
      },
    });

    const token = makeSessionToken(
      { uid: user.id, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 },
      process.env.SESSION_SECRET
    );

    const res = NextResponse.redirect(
      new URL("/dashboard?status=success", getBaseUrl(req))
    );

    res.cookies.set(sessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err: any) {
    const msg = encodeURIComponent(err?.message || "error");
    return NextResponse.redirect(
      new URL(`/pricing?status=error&message=${msg}`, getBaseUrl(req))
    );
  }
}