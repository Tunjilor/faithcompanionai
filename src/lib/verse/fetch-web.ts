export async function fetchWEBVerse(reference: string) {
  // bible-api.com supports WEB. Reference must be URL encoded.
  const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=web`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Verse fetch failed (${res.status})`);

  const data = await res.json();

  // bible-api returns `text`
  const text = String(data?.text || "").trim();
  if (!text) throw new Error("Empty verse text");

  return {
    reference: String(data?.reference || reference),
    text,
    sourceUrl: url,
    translation: "WEB",
  };
}
