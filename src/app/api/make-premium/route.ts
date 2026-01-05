import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email") || "test@example.com";

  const user = await db.user.upsert({
    where: { email },
    update: { isPremium: true, premiumUntil: null },
    create: { email, isPremium: true, premiumUntil: null },
  });

  return NextResponse.json({ ok: true, email: user.email, isPremium: user.isPremium });
}
