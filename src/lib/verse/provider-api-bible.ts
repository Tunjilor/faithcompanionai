// src/lib/verse/provider-api-bible.ts

import type { VerseTextResult, VerseRef } from "./types";

/**
 * Skeleton for API.Bible (paid) provider.
 * You must set:
 * - BIBLE_API_KEY
 * - BIBLE_API_BIBLE_ID  (the bible/version id for WEB if supported)
 *
 * Then implement the exact endpoint(s) you choose.
 */
export async function fetchFromApiBible(ref: VerseRef): Promise<VerseTextResult> {
  const apiKey = process.env.BIBLE_API_KEY;
  const bibleId = process.env.BIBLE_API_BIBLE_ID;

  if (!apiKey || !bibleId) {
    throw new Error("Missing BIBLE_API_KEY or BIBLE_API_BIBLE_ID env vars");
  }

  // API.Bible does NOT usually accept "John 3:16" directly.
  // You typically need passage IDs. So this stays a placeholder.
  // Implement lookup/mapping later.

  throw new Error("API.Bible provider not implemented yet");
}
