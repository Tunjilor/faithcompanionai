import crypto from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    // Look up user — but always return the same response to avoid email enumeration
    const user = await db.user.findUnique({ where: { email } }).catch(() => null);

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(token);
      const expiresAt = new Date(Date.now() + 1000 * 60 * 20); // 20 minutes

      await db.passwordResetToken.create({ data: { email, tokenHash, expiresAt } });

      const reqOrigin = new URL(req.url).origin;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || reqOrigin;
      const resetLink = `${appUrl}/reset-password?token=${token}`;

      await sendPasswordResetEmail({ to: email, resetLink });

      // Expose link in dev when Resend is not configured
      if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ ok: true, devResetLink: resetLink });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[password/reset/request] error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
