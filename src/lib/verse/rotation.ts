// src/lib/verse/rotation.ts

import type { VerseRef } from "./types";

/**
 * A small, safe MVP list. Expand anytime.
 * This picks one reference per day, deterministically (UTC).
 */
const ROTATION: VerseRef[] = [
  { reference: "John 3:16", translation: "WEB" },
  { reference: "Psalm 23:1", translation: "WEB" },
  { reference: "Proverbs 3:5-6", translation: "WEB" },
  { reference: "Romans 8:28", translation: "WEB" },
  { reference: "Philippians 4:6-7", translation: "WEB" },
  { reference: "Isaiah 41:10", translation: "WEB" },
  { reference: "Matthew 11:28", translation: "WEB" },
  { reference: "Psalm 46:1", translation: "WEB" },
  { reference: "2 Timothy 1:7", translation: "WEB" },
  { reference: "James 1:5", translation: "WEB" }
];

/**
 * Returns day key like "2026-01-31" in UTC.
 */
export function getUtcDayKey(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Deterministic index: days since epoch mod rotation length.
 */
export function pickDailyVerseRef(dayKey: string): VerseRef {
  const [y, m, d] = dayKey.split("-").map((x) => parseInt(x, 10));
  const utcMidnight = Date.UTC(y, m - 1, d);
  const daysSinceEpoch = Math.floor(utcMidnight / (1000 * 60 * 60 * 24));

  const idx = Math.abs(daysSinceEpoch) % ROTATION.length;
  return ROTATION[idx];
}
