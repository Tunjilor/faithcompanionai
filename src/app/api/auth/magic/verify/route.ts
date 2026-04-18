// src/app/api/auth/magic/verify/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
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
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?error=missing_token", url.origin)
      );
    }

    const tokenHash = hashToken(token);

    const record = await db.magicLinkToken.findUnique({
      where: { tokenHash },
    });

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

    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          isPremium: false,
        },
      });
    }

    await db.magicLinkToken.update({
      where: { tokenHash },
      data: {
        usedAt: new Date(),
      },
    });

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      return NextResponse.redirect(
        new URL("/login?error=missing_session_secret", url.origin)
      );
    }

    const exp = makeSessionExpiry(30);
    const sessionToken = createSessionToken(
      { uid: user.id, exp },
      secret
    );

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
    console.error("GET /api/auth/magic/verify error:", err);
    const url = new URL(req.url);
    return NextResponse.redirect(
      new URL("/login?error=verify_failed", url.origin)
    );
  }
}