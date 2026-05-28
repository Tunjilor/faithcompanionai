// src/app/api/bible/search/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sha(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json({ ok: false, error: "query_too_short" }, { status: 400 });
  }

  const apiKey = process.env.API_BIBLE_KEY;
  const bibleId = process.env.API_BIBLE_BIBLE_ID;

  if (!apiKey || !bibleId) {
    return NextResponse.json({ ok: false, error: "missing_api_config" }, { status: 500 });
  }

  const cacheKey = sha(`bible_search:${bibleId}:${q.toLowerCase()}`);

  const cached = await db.bibleSearchCache.findUnique({ where: { cacheKey } });
  if (cached) {
    return NextResponse.json({ ok: true, cached: true, data: JSON.parse(cached.json) });
  }

  // API.Bible request (endpoint details may vary by plan/version;
  // keep this in one place so it’s easy to adjust)
  const resp = await fetch(`https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodeURIComponent(q)}`, {
    headers: { "api-key": apiKey },
    cache: "no-store",
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    return NextResponse.json({ ok: false, error: "provider_error", detail: text.slice(0, 400) }, { status: 502 });
  }

  const data = await resp.json();

  await db.bibleSearchCache.upsert({
    where: { cacheKey },
    create: { cacheKey, bibleId, query: q, json: JSON.stringify(data) },
    update: { json: JSON.stringify(data), query: q, bibleId },
  });

  return NextResponse.json({ ok: true, cached: false, data });
}