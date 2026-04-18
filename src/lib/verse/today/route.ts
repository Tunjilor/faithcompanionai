// src/lib/verse/today/route.tx
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { dayKeyUTC, pickDailyReference } from "@/lib/verse/pick-daily";
import { fetchWEBVerse } from "@/lib/verse/fetch-web";

export const runtime = "nodejs";

export async function GET() {
  const dayKey = dayKeyUTC();
  const translation = "WEB";

  const existing = await db.verseCache.findUnique({
    where: { dayKey_translation: { dayKey, translation } },
  });

  if (existing) {
    return NextResponse.json({
      dayKey,
      translation,
      reference: existing.reference,
      text: existing.text,
      sourceUrl: existing.sourceUrl,
    });
  }

  const reference = pickDailyReference(dayKey);
  const verse = await fetchWEBVerse(reference);

  const saved = await db.verseCache.create({
    data: {
      dayKey,
      translation,
      reference: verse.reference,
      text: verse.text,
      sourceUrl: verse.sourceUrl,
    },
  });

  return NextResponse.json({
    dayKey,
    translation,
    reference: saved.reference,
    text: saved.text,
    sourceUrl: saved.sourceUrl,
  });
}
