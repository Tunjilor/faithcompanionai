// src/lib/verse/provider-bible-api-com.ts

import type { VerseTextResult, VerseRef } from "./types";

/**
 * MVP provider using bible-api.com
 * Example:
 * https://bible-api.com/John%203:16?translation=web
 */
export async function fetchFromBibleApiCom(ref: VerseRef): Promise<VerseTextResult> {
  const encoded = encodeURIComponent(ref.reference);
  const url = `https://bible-api.com/${encoded}?translation=web`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`bible-api.com error: ${res.status}`);
  }

  const data: any = await res.json();

  // bible-api returns "text" and "reference"
  const textRaw = typeof data?.text === "string" ? data.text : "";
  const text = textRaw.trim();

  if (!text) throw new Error("Empty verse text returned");

  return {
    reference: ref.reference,
    translation: ref.translation,
    text,
    sourceUrl: url
  };
}
