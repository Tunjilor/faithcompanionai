// src/lib/auth/verify/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readMagicLinkToken } from "@/lib/magicLink";
import {
  createSessionToken,
  defaultSessionCookieOptions,
  sessionCookieName,
} from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Missing SESSION_SECRET" },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token") || undefined;
  const redirect = url.searchParams.get("redirect") || "/";

  const payload = readMagicLinkToken(token, secret);
  if (!payload) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_link", url.origin)
    );
  }

  const email = payload.email.toLowerCase().trim();

  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const sessionToken = createSessionToken({ uid: user.id, exp }, secret);

  const res = NextResponse.redirect(new URL(redirect, url.origin));
  res.cookies.set(sessionCookieName(), sessionToken, {
    ...defaultSessionCookieOptions(),
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
}