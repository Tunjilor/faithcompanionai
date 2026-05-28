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

  // Log every invocation so we can confirm the deployed build is running.
  console.log("[magic/verify] invoked", {
    origin: url.origin,
    hasToken: url.searchParams.has("token"),
    hasSessionSecret: !!process.env.SESSION_SECRET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
  });

  try {
    const token = url.searchParams.get("token");

    if (!token) {
      console.warn("[magic/verify] missing token param");
      return NextResponse.redirect(
        new URL("/login?error=missing_token", url.origin)
      );
    }

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      console.error("[magic/verify] SESSION_SECRET is not set");
      return NextResponse.redirect(
        new URL("/login?error=missing_session_secret", url.origin)
      );
    }

    const tokenHash = hashToken(token);
    console.log("[magic/verify] looking up token hash", tokenHash.slice(0, 12) + "…");

    let record: Awaited<ReturnType<typeof db.magicLinkToken.findUnique>>;
    try {
      record = await withDbRetry(() =>
        db.magicLinkToken.findUnique({ where: { tokenHash } })
      );
    } catch (dbErr) {
      console.error("[magic/verify] DB error on token lookup:", {
        message: dbErr instanceof Error ? dbErr.message : String(dbErr),
        code: (dbErr as any)?.code,
        meta: (dbErr as any)?.meta,
      });
      throw dbErr;
    }

    if (!record) {
      console.warn("[magic/verify] token not found in DB");
      return NextResponse.redirect(
        new URL("/login?error=invalid_link", url.origin)
      );
    }

    if (record.usedAt) {
      console.warn("[magic/verify] token already used at", record.usedAt);
      return NextResponse.redirect(
        new URL("/login?error=link_used", url.origin)
      );
    }

    if (record.expiresAt.getTime() < Date.now()) {
      console.warn("[magic/verify] token expired at", record.expiresAt);
      return NextResponse.redirect(
        new URL("/login?error=link_expired", url.origin)
      );
    }

    console.log("[magic/verify] token valid, resolving user for", record.email);
    const email = normalizeEmail(record.email);

    let user: Awaited<ReturnType<typeof db.user.findUnique>>;
    try {
      user = await withDbRetry(() =>
        db.user.findUnique({ where: { email } })
      );
    } catch (dbErr) {
      console.error("[magic/verify] DB error on user lookup:", {
        message: dbErr instanceof Error ? dbErr.message : String(dbErr),
        code: (dbErr as any)?.code,
      });
      throw dbErr;
    }

    if (!user) {
      try {
        user = await withDbRetry(() =>
          db.user.create({ data: { email, isPremium: false } })
        );
        console.log("[magic/verify] created new user", user.id);
      } catch (dbErr) {
        console.error("[magic/verify] DB error creating user:", {
          message: dbErr instanceof Error ? dbErr.message : String(dbErr),
          code: (dbErr as any)?.code,
          meta: (dbErr as any)?.meta,
        });
        throw dbErr;
      }
    } else {
      console.log("[magic/verify] found existing user", user.id);
    }

    try {
      await withDbRetry(() =>
        db.magicLinkToken.update({
          where: { tokenHash },
          data: { usedAt: new Date() },
        })
      );
    } catch (dbErr) {
      console.error("[magic/verify] DB error marking token used:", {
        message: dbErr instanceof Error ? dbErr.message : String(dbErr),
      });
      // Non-fatal — user is already resolved; proceed with login.
    }

    const exp = makeSessionExpiry(30);
    const sessionToken = createSessionToken({ uid: user.id, exp }, secret);

    console.log("[magic/verify] success — redirecting to /dashboard");
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
    console.error("[magic/verify] FATAL unhandled error:", {
      message: err instanceof Error ? err.message : String(err),
      name: err instanceof Error ? err.name : undefined,
      stack: err instanceof Error ? err.stack?.split("\n").slice(0, 6).join("\n") : undefined,
      code: (err as any)?.code,
      meta: (err as any)?.meta,
    });
    return NextResponse.redirect(
      new URL("/login?error=verify_failed", url.origin)
    );
  }
}