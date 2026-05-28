// src/app/api/prayer-requests/[id]/pray/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id?.trim();
    if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

    const updated = await db.prayerRequest.update({
      where: { id },
      data: { prayCount: { increment: 1 } },
      select: { id: true, prayCount: true },
    });

    return NextResponse.json({ id: updated.id, prayCount: updated.prayCount });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Prayer not found." }, { status: 404 });
    }
    console.error("POST /api/prayer-requests/[id]/pray error:", err);
    return NextResponse.json({ error: "Failed to record prayer." }, { status: 500 });
  }
}
