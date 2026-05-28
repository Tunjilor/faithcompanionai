// src/app/api/prayer-requests/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const prayers = await db.prayerRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, name: true, text: true, prayCount: true, createdAt: true },
    });
    return NextResponse.json({ prayers });
  } catch (err) {
    console.error("GET /api/prayer-requests error:", err);
    return NextResponse.json({ error: "Failed to load prayers." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const text = typeof body?.text === "string" ? body.text.trim().slice(0, 200) : "";
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 50) : null;

    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: "Prayer request must be at least 5 characters." },
        { status: 400 }
      );
    }

    const prayer = await db.prayerRequest.create({
      data: { text, name: name || null },
      select: { id: true, name: true, text: true, prayCount: true, createdAt: true },
    });

    return NextResponse.json({ prayer }, { status: 201 });
  } catch (err) {
    console.error("POST /api/prayer-requests error:", err);
    return NextResponse.json({ error: "Failed to submit prayer." }, { status: 500 });
  }
}
