import crypto from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, withDbRetry } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const token = typeof body?.token === "string" ? body.token : "";
    const newPassword = typeof body?.password === "string" ? body.password : "";

    if (!token) {
      return NextResponse.json({ error: "Missing reset token." }, { status: 400 });
    }
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const tokenHash = hashToken(token);

    const record = await withDbRetry(() =>
      db.passwordResetToken.findUnique({ where: { tokenHash } })
    );

    if (!record) {
      return NextResponse.json({ error: "This reset link is invalid." }, { status: 400 });
    }
    if (record.usedAt) {
      return NextResponse.json({ error: "This reset link has already been used." }, { status: 400 });
    }
    if (record.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await withDbRetry(() =>
      db.user.update({ where: { email: record.email }, data: { passwordHash } })
    );
    await withDbRetry(() =>
      db.passwordResetToken.update({ where: { tokenHash }, data: { usedAt: new Date() } })
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[password/reset/confirm] error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
