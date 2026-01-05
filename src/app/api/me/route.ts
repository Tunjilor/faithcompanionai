import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { readSessionToken, sessionCookieName } from "@/lib/session";

type SessionPayload = { uid: string; exp: number };

export async function GET() {
  const secret = process.env.SESSION_SECRET;

  const token = (await cookies()).get(sessionCookieName())?.value;

  if (!secret) {
    return NextResponse.json(
      { premium: false, debug: { step: "missing_secret", hasToken: !!token } },
      { status: 500 }
    );
  }

  if (!token) {
    return NextResponse.json({
      premium: false,
      debug: { step: "no_cookie", cookieName: sessionCookieName() },
    });
  }

  const payload = readSessionToken<SessionPayload>(token, secret);
  if (!payload) {
    return NextResponse.json({
      premium: false,
      debug: { step: "bad_token" },
    });
  }

  if (Date.now() > payload.exp) {
    return NextResponse.json({
      premium: false,
      debug: { step: "token_expired", exp: payload.exp },
    });
  }

  const user = await db.user.findUnique({ where: { id: payload.uid } });
  if (!user) {
    return NextResponse.json({
      premium: false,
      debug: { step: "user_not_found", uid: payload.uid },
    });
  }

  const now = new Date();
  const premium =
    user.isPremium && (!user.premiumUntil || user.premiumUntil.getTime() > now.getTime());

  return NextResponse.json({
    premium,
    premiumUntil: user.premiumUntil ? user.premiumUntil.toISOString() : null,
    email: user.email,
    debug: {
      step: "ok",
      uid: user.id,
      isPremium: user.isPremium,
      hasPremiumUntil: !!user.premiumUntil,
    },
  });
}
