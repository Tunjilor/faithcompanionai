import { DAILY_VERSE_REFERENCES } from "./verse-list";
import { sha256 } from "@/lib/ai/hash";

export function dayKeyUTC(d = new Date()) {
  // YYYY-MM-DD in UTC
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    .toISOString()
    .slice(0, 10);
}

export function pickDailyReference(dayKey: string) {
  const h = sha256(dayKey);
  // take first 8 hex chars -> int
  const n = parseInt(h.slice(0, 8), 16);
  const idx = n % DAILY_VERSE_REFERENCES.length;
  return DAILY_VERSE_REFERENCES[idx];
}
