// src/app/api/auth/magic/request/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = normalizeEmail(rawEmail);

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 20); // 20 minutes

    await db.magicLinkToken.create({
      data: {
        email,
        tokenHash,
        expiresAt,
      },
    });

    // Derive the base URL from the incoming request so the magic link is
    // always valid for the environment that generated it (local, preview, prod).
    // NEXT_PUBLIC_APP_URL can still override this for custom domain setups.
    const reqOrigin = new URL(req.url).origin;
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.trim() || reqOrigin;

    const magicLink = `${appUrl}/api/auth/magic/verify?token=${token}`;

    await sendMagicLinkEmail({ to: email, magicLink });

    return NextResponse.json({
      ok: true,
      message: "Check your email for your login link.",
      ...(process.env.RESEND_API_KEY
        ? {}
        : { devMagicLink: magicLink }),
    });
  } catch (err: any) {
    console.error("POST /api/auth/magic/request error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to send magic link." },
      { status: 500 }
    );
  }
}
