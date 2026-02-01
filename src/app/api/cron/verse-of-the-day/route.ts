// src/app/api/verse-of-the-day/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getUtcDayKey, pickDailyVerseRef } from "@/lib/verse/rotation";
import { getVerseText } from "@/lib/verse/get-verse-text";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const translation = (url.searchParams.get("translation") || "WEB").toUpperCase();

  if (translation !== "WEB") {
    return NextResponse.json({ error: "Only WEB supported for now" }, { status: 400 });
  }

  const dayKey = getUtcDayKey(new Date());

  // Try cache first
  const cached = await db.verseCache.findFirst({
    where: { dayKey, translation: "WEB" }
  });

  if (cached) {
    return NextResponse.json({
      dayKey,
      translation: cached.translation,
      reference: cached.reference,
      text: cached.text,
      sourceUrl: cached.sourceUrl,
      cached: true
    });
  }

  // Fallback: generate on-demand if cron didn’t run yet
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
    dayKey,
    translation: verse.translation,
    reference: verse.reference,
    text: verse.text,
    sourceUrl: verse.sourceUrl,
    cached: false
  });
}
