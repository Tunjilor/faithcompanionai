// src/app/api/auth/password/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, withDbRetry } from "@/lib/db";
import { createSessionToken, makeSessionExpiry, sessionCookieName } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Enter your password." }, { status: 400 });
    }

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Auth not configured." }, { status: 500 });
    }

    const user = await withDbRetry(() =>
      db.user.findUnique({ where: { email } })
    );

    // Generic message to avoid user enumeration
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "No password login set up for this account. Use your magic link email instead." },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const exp = makeSessionExpiry(30);
    const sessionToken = createSessionToken({ uid: user.id, exp }, secret);

    const url = new URL(req.url);
    const res = NextResponse.json({ ok: true });

    res.cookies.set(sessionCookieName(), sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(exp),
    });

    return res;
  } catch (err) {
    console.error("[auth/password] error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
