import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { makeSessionToken, sessionCookieName } from "@/lib/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email") || "test@example.com";

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Missing SESSION_SECRET" }, { status: 500 });
  }

  // create a user if not exists
  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: { email, isPremium: false },
  });

  const token = makeSessionToken(
    { uid: user.id, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 },
    secret
  );

  (await cookies()).set(sessionCookieName(), token, {
    httpOnly: true,
    secure: false, // localhost
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ ok: true, email, uid: user.id, cookieSet: sessionCookieName() });
}
