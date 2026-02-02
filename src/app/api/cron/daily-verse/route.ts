// src/app/api/cron/daily-verse/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getUtcDayKey, pickDailyVerseRef } from "@/lib/verse/rotation";
import { getVerseText } from "@/lib/verse/get-verse-text";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");

    const expected = process.env.CRON_SECRET;
    if (!expected) {
      return NextResponse.json({ ok: false, error: "Missing CRON_SECRET" }, { status: 500 });
    }
    if (secret !== expected) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const dayKey = getUtcDayKey(new Date());
    const translation = "WEB";

    // ✅ works even without compound unique
    const existing = await db.verseCache.findFirst({
      where: { dayKey, translation },
      select: { id: true, reference: true },
    });

    if (existing) {
      return NextResponse.json({
        ok: true,
        cached: true,
        dayKey,
        translation,
        reference: existing.reference,
      });
    }

    const ref = pickDailyVerseRef(dayKey);
    const verse = await getVerseText(ref);

    await db.verseCache.create({
      data: {
        dayKey,
        translation,
        reference: verse.reference,
        text: verse.text,
        sourceUrl: verse.sourceUrl ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      cached: false,
      dayKey,
      translation,
      reference: verse.reference,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
