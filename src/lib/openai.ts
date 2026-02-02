import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAI() {
  if (_client) return _client;

  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Missing OPENAI_API_KEY");

  _client = new OpenAI({ apiKey: key });
  return _client;
}

export function getModel() {
  return process.env.OPENAI_MODEL || "gpt-4.1-mini";
}
