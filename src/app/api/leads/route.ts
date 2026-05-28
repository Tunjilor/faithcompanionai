// src/app/api/leads/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const source =
      typeof body?.source === "string" && body.source.trim()
        ? body.source.trim()
        : null;

    await db.lead.upsert({
      where: { email },
      update: { ...(source ? { source } : {}) },
      create: { email, ...(source ? { source } : {}) },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
