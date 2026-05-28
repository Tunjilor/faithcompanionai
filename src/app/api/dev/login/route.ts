// src/app/api/dev/login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  createSessionToken,
  defaultSessionCookieOptions,
  makeSessionExpiry,
  sessionCookieName,
} from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email =
    url.searchParams.get("email")?.toLowerCase().trim() || "test@example.com";

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Missing SESSION_SECRET" },
      { status: 500 }
    );
  }

  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      isPremium: false,
    },
  });

  const token = createSessionToken(
    { uid: user.id, exp: makeSessionExpiry(7) },
    secret
  );

  const res = NextResponse.json({
    ok: true,
    email,
    uid: user.id,
    cookieSet: sessionCookieName(),
  });

  res.cookies.set(sessionCookieName(), token, {
    ...defaultSessionCookieOptions(),
    secure: false,
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
}