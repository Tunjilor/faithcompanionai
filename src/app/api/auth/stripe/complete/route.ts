// src/app/api/auth/stripe/complete/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { makeSessionToken, sessionCookieName } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // Stripe typically returns you here with ?session_id=cs_...
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.redirect(new URL("/pricing?status=missing_session", url));
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });

    const email =
      session.customer_details?.email ||
      (typeof session.customer_email === "string" ? session.customer_email : null);

    if (!email) {
      return NextResponse.redirect(new URL("/pricing?status=missing_email", url));
    }

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? null;

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id ?? null;

    // Mark user premium (simple starter approach)
    const user = await db.user.upsert({
      where: { email },
      update: {
        stripeCustomerId: customerId ?? undefined,
        stripeSubscriptionId: subscriptionId ?? undefined,
        isPremium: true,
      },
      create: {
        email,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        isPremium: true,
      },
    });

    // Issue your app session cookie
    const token = await makeSessionToken({
      userId: user.id,
      email: user.email,
      isPremium: user.isPremium ?? false,
    });

    cookies().set(sessionCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.redirect(new URL("/dashboard?status=success", url));
  } catch (err: any) {
    // If stripe env var missing, or retrieve fails, don't white-screen
    const url = new URL(req.url);
    return NextResponse.redirect(
      new URL(`/pricing?status=error&message=${encodeURIComponent(err?.message || "error")}`, url)
    );
  }
}
