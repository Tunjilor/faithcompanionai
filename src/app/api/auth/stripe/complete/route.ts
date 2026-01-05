import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { makeSessionToken, sessionCookieName } from "@/lib/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  const redirect = url.searchParams.get("redirect") || "/pricing?success=1";

  const secret = process.env.SESSION_SECRET;
  if (!secret) return NextResponse.redirect(new URL("/pricing?error=server", url.origin));

  if (!sessionId) return NextResponse.redirect(new URL("/pricing?error=missing_session", url.origin));

  // Retrieve checkout session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const email = session.customer_details?.email || session.customer_email;
  const customerId = typeof session.customer === "string" ? session.customer : null;

  if (!email) return NextResponse.redirect(new URL("/pricing?error=no_email", url.origin));

  const paid = session.payment_status === "paid";
  const isSubscription = !!session.subscription;

  const premium = paid; // for subscriptions + one-time, paid means premium
  const premiumUntil = isSubscription
    ? null
    : new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000); // ~10 years placeholder

  const user = await db.user.upsert({
    where: { email },
    update: {
      stripeCustomerId: customerId || undefined,
      isPremium: premium ? true : undefined,
      premiumUntil: premiumUntil || undefined,
    },
    create: {
      email,
      stripeCustomerId: customerId || undefined,
      isPremium: premium,
      premiumUntil: premiumUntil || undefined,
    },
  });

  // 7-day session cookie
  const token = makeSessionToken({ uid: user.id, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }, secret);

  (await cookies()).set(sessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.redirect(new URL(redirect, url.origin));
}
