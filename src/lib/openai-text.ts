// src/lib/openai-text.ts
export function getOutputText(resp: unknown): string {
  const r: any = resp;
  if (typeof r?.output_text === "string") return r.output_text;
  return "";
}

export function extractResponseText(resp: any): string {
  // Responses API often returns output_text, but types may vary.
  if (typeof resp?.output_text === "string") return resp.output_text;

  // Fallback: walk output array (defensive)
  const out = resp?.output;
  if (!Array.isArray(out)) return "";

  const texts: string[] = [];
  for (const item of out) {
    const content = item?.content;
    if (!Array.isArray(content)) continue;
    for (const c of content) {
      if (typeof c?.text === "string") texts.push(c.text);
      if (typeof c?.output_text === "string") texts.push(c.output_text);
    }
  }
  return texts.join("\n").trim();
}
