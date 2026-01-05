import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  await db.lead.upsert({
    where: { email },
    update: {},
    create: { email, source: String(body?.source || "quiz") },
  });

  return NextResponse.json({ ok: true });
}
