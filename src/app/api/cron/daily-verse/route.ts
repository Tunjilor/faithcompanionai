// src/app/api/cron/daily-verse/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getUtcDayKey, pickDailyVerseRef } from "@/lib/verse/rotation";
import { getVerseText } from "@/lib/verse/get-verse-text";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Missing CRON_SECRET" }, { status: 500 });
  }
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dayKey = getUtcDayKey(new Date());

  // Already cached today?
  const existing = await db.verseCache.findFirst({
    where: { dayKey, translation: "WEB" }
  });

  if (existing) {
    return NextResponse.json({
      ok: true,
      cached: true,
      dayKey,
      reference: existing.reference
    });
  }

  const ref = pickDailyVerseRef(dayKey);
  const verse = await getVerseText(ref);

  await db.verseCache.create({
    data: {
      dayKey,
      translation: verse.translation,
      reference: verse.reference,
      text: verse.text,
      sourceUrl: verse.sourceUrl
    }
  });

  return NextResponse.json({
    ok: true,
    cached: false,
    dayKey,
    reference: verse.reference
  });
}
