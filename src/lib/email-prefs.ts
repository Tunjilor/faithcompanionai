// src/lib/email-prefs.ts
import crypto from "crypto";

export function makeUnsubscribeToken(userId: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(`unsub:${userId}`)
    .digest("hex");
}

export function verifyUnsubscribeToken(
  userId: string,
  token: string,
  secret: string
): boolean {
  try {
    const expected = makeUnsubscribeToken(userId, secret);
    const a = Buffer.from(token, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Returns the hour (0-23) in a given IANA timezone for a given Date. */
export function hourInTimezone(date: Date, tz: string): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      hour12: false,
    }).formatToParts(date);
    const h = parts.find((p) => p.type === "hour")?.value ?? "0";
    return parseInt(h, 10) % 24;
  } catch {
    return date.getUTCHours();
  }
}

/** Parse "07:00" → 7 */
export function parseEmailHour(emailTime: string): number {
  const [h] = emailTime.split(":");
  return parseInt(h ?? "7", 10);
}

/** Day-of-week content type (Mon/Wed → verse, Tue/Thu → devotional, else → prayer) */
export function contentTypeForDate(date: Date, tz: string): "verse" | "devotional" | "prayer" {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
    }).formatToParts(date);
    const day = parts.find((p) => p.type === "weekday")?.value;
    if (day === "Mon" || day === "Wed") return "verse";
    if (day === "Tue" || day === "Thu") return "devotional";
    return "prayer";
  } catch {
    const dow = date.getUTCDay(); // 0=Sun,1=Mon,...,6=Sat
    if (dow === 1 || dow === 3) return "verse";
    if (dow === 2 || dow === 4) return "devotional";
    return "prayer";
  }
}
