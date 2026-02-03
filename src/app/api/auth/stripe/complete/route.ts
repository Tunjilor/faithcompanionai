// src/app/api/auth/stripe/complete/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // your db.ts exports `db`
import { stripe } from "@/lib/stripe"; // ensure src/lib/stripe.ts exports `stripe`
import { makeSessionToken, sessionCookieName } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(req: Request) {
  // Works on Vercel + local
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
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

    // Retrieve the checkout session
    const cs = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });

    // Determine email (required for your User upsert)
    const email =
      cs.customer_details?.email ||
      cs.customer_email ||
      (typeof cs.customer === "object" ? (cs.customer.email ?? null) : null);

    if (!email) {
      return NextResponse.redirect(
        new URL("/pricing?status=error&message=missing_email", getBaseUrl(req))
      );
    }

    const customerId =
      typeof cs.customer === "string" ? cs.customer : (cs.customer?.id ?? null);

    const subscriptionId =
      typeof cs.subscription === "string"
        ? cs.subscription
        : (cs.subscription?.id ?? null);

    // Mark user premium (you can refine premiumUntil later from subscription current_period_end)
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

    // Issue your app session cookie (30 days)
    const token = makeSessionToken(
      {
        uid: user.id,
        exp: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days (ms)
      },
      process.env.SESSION_SECRET
    );

    const res = NextResponse.redirect(
      new URL("/dashboard?status=success", getBaseUrl(req))
    );

    // IMPORTANT: In route handlers, set cookies on the response object.
    res.cookies.set(sessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // Next expects seconds here:
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
