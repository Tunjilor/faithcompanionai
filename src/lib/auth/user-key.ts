import { headers } from "next/headers";
import { sha256 } from "@/lib/ai/hash";

export function getAnonUserKey() {
  const h = headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown-ip";
  const ua = h.get("user-agent") || "unknown-ua";
  return `anon_${sha256(`${ip}|${ua}`).slice(0, 16)}`;
}

/**
 * If you already have a real auth session that can provide email,
 * wire it here later. For now: anonymous key only.
 */
export function getUserKeyMaybeEmail(): { userKey: string; email?: string } {
  // TODO: if you have a session cookie that includes email, parse it here.
  // For “set it and forget it”, we keep it simple.
  const userKey = getAnonUserKey();
  return { userKey };
}
