// src/lib/openai-ts.ts
import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing on the server.");
  }

  if (!_client) {
    _client = new OpenAI({ apiKey });
  }

  return _client;
}

export function getModel() {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

/**
 * The OpenAI "Responses API" often returns `output_text` at runtime,
 * but some SDK typings don't expose it. This helper safely extracts text
 * without using @ts-expect-error and without breaking Vercel build.
 */
export function extractOutputText(resp: unknown): string {
  const anyResp = resp as any;

  // 1) Common runtime shortcut
  if (typeof anyResp?.output_text === "string") {
    return anyResp.output_text;
  }

  // 2) Some SDK shapes: output -> [{ content: [{ type, text }] }]
  const output = anyResp?.output;
  if (Array.isArray(output)) {
    const parts: string[] = [];

    for (const item of output) {
      const content = item?.content;
      if (!Array.isArray(content)) continue;

      for (const c of content) {
        // "output_text" blocks
        if (c?.type === "output_text" && typeof c?.text === "string") {
          parts.push(c.text);
        }
        // Some variants may use { type: "text", text: "..." }
        else if (c?.type === "text" && typeof c?.text === "string") {
          parts.push(c.text);
        }
      }
    }

    if (parts.length) return parts.join("\n").trim();
  }

  // 3) Fallback: try chat.completions-style shape
  const choiceText = anyResp?.choices?.[0]?.message?.content;
  if (typeof choiceText === "string") return choiceText.trim();

  return "";
}
