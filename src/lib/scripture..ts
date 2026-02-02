export type VerseResult = {
  reference: string;
  text: string;
  sourceUrl?: string;
  translation: string; // "WEB"
};

export async function fetchVerseText(reference: string, translation = "WEB"): Promise<VerseResult> {
  // Default provider (simple + free)
  const base = process.env.SCRIPTURE_API_BASE || "https://bible-api.com";
  const url = `${base}/${encodeURIComponent(reference)}?translation=${encodeURIComponent(translation.toLowerCase())}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Verse fetch failed (${res.status})`);

  const data = await res.json();
  const text = String(data?.text || "").trim();

  if (!text) throw new Error("Verse text empty");

  return {
    reference: String(data?.reference || reference),
    text,
    sourceUrl: url,
    translation,
  };
}
