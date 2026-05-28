// src/lib/verse/get-verse-text.ts

import type { VerseRef, VerseTextResult } from "./types";
import { fetchFromBibleApiCom } from "./provider-bible-api-com";
// import { fetchFromApiBible } from "./provider-api-bible";

type ProviderName = "bible-api-com" | "api-bible";

/**
 * Pick provider via env:
 * VERSE_PROVIDER=bible-api-com   (default)
 * VERSE_PROVIDER=api-bible
 */
export async function getVerseText(ref: VerseRef): Promise<VerseTextResult> {
  const provider = (process.env.VERSE_PROVIDER || "bible-api-com") as ProviderName;

  if (provider === "api-bible") {
    // return fetchFromApiBible(ref);
    throw new Error("VERSE_PROVIDER=api-bible selected but provider not implemented");
  }

  return fetchFromBibleApiCom(ref);
}
