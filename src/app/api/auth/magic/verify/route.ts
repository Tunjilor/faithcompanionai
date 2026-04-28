// src/app/api/auth/magic/verify/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { db, withDbRetry } from "@/lib/db";
import {
  createSessionToken,
  makeSessionExpiry,
  sessionCookieName,
} from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?error=missing_token", url.origin)
      );
    }

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      return NextResponse.redirect(
        new URL("/login?error=missing_session_secret", url.origin)
      );
    }

    const tokenHash = hashToken(token);

    // Wrap all DB operations in withDbRetry to survive Neon cold starts.
    // Without retry, a connection failure on the first query throws, which
    // the old catch block would silently swallow as verify_failed.
    const record = await withDbRetry(() =>
      db.magicLinkToken.findUnique({ where: { tokenHash } })
    );

    if (!record) {
      return NextResponse.redirect(
        new URL("/login?error=invalid_link", url.origin)
      );
    }

    if (record.usedAt) {
      return NextResponse.redirect(
        new URL("/login?error=link_used", url.origin)
      );
    }

    if (record.expiresAt.getTime() < Date.now()) {
      return NextResponse.redirect(
        new URL("/login?error=link_expired", url.origin)
      );
    }

    const email = normalizeEmail(record.email);

    let user = await withDbRetry(() =>
      db.user.findUnique({ where: { email } })
    );

    if (!user) {
      user = await withDbRetry(() =>
        db.user.create({ data: { email, isPremium: false } })
      );
    }

    // Mark token consumed after user is resolved so a DB failure during
    // user lookup doesn't invalidate the token before a successful login.
    await withDbRetry(() =>
      db.magicLinkToken.update({
        where: { tokenHash },
        data: { usedAt: new Date() },
      })
    );

    const exp = makeSessionExpiry(30);
    const sessionToken = createSessionToken({ uid: user.id, exp }, secret);

    const res = NextResponse.redirect(new URL("/dashboard", url.origin));

    res.cookies.set(sessionCookieName(), sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(exp),
    });

    return res;
  } catch (err) {
    console.error("[magic/verify] unhandled error:", err);
    return NextResponse.redirect(
      new URL("/login?error=verify_failed", url.origin)
    );
  }
}