// src/lib/auth/request-link/route.ts
import { NextResponse } from "next/server";
import { makeMagicLinkToken } from "@/lib/magicLink";
import { sendMagicLinkEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Missing SESSION_SECRET" },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { email?: string; redirect?: string }
    | null;

  const email = body?.email?.toLowerCase().trim();
  const redirect = body?.redirect || "/";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Enter a valid email" },
      { status: 400 }
    );
  }

  const url = new URL(req.url);
  const origin = url.origin;

  const token = makeMagicLinkToken(email, secret, 15);

  const magicLink = `${origin}/api/auth/verify?token=${encodeURIComponent(
    token
  )}&redirect=${encodeURIComponent(redirect)}`;

  await sendMagicLinkEmail({
    to: email,
    magicLink,
  });

  return NextResponse.json({ ok: true });
}