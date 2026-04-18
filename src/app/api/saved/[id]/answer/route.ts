// src/app/api/saved/[id]/answer/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePremiumUserFromSession } from "@/lib/premium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requirePremiumUserFromSession();

    const itemId = params.id?.trim();
    if (!itemId) {
      return NextResponse.json({ error: "Missing item id." }, { status: 400 });
    }

    const body = await req.json().catch(() => ({})) as { answerNote?: string; unmark?: boolean };

    // Verify the item belongs to this user and is a prayer
    const existing = await db.savedItem.findFirst({
      where: { id: itemId, userId: user.id, type: "prayer" },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Prayer not found." }, { status: 404 });
    }

    if (body.unmark) {
      // Allow toggling off
      const updated = await db.savedItem.update({
        where: { id: itemId },
        data: { answeredAt: null, answerNote: null },
        select: { id: true, answeredAt: true, answerNote: true },
      });
      return NextResponse.json({ ok: true, item: updated });
    }

    const answerNote = typeof body.answerNote === "string" ? body.answerNote.trim().slice(0, 1000) : null;

    const updated = await db.savedItem.update({
      where: { id: itemId },
      data: { answeredAt: new Date(), answerNote: answerNote || null },
      select: { id: true, answeredAt: true, answerNote: true },
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch (err: any) {
    const status = typeof err?.status === "number" ? err.status : 500;
    if (status >= 500) console.error("PATCH /api/saved/[id]/answer error:", err);
    return NextResponse.json({ error: err?.message || "Failed to update prayer." }, { status });
  }
}
