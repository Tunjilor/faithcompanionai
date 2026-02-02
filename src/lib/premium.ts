import { cookies, headers } from "next/headers";
import { db } from "@/lib/prisma";
import { sha256, dayKeyUTC } from "@/lib/hash";

export async function getUserKey() {
  const c = await cookies();
  const email = c.get("fcai_email")?.value; // optional, if you ever set it
  if (email) return `email:${sha256(email.toLowerCase().trim())}`;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";
  const ua = h.get("user-agent") || "unknown-ua";
  return `anon:${sha256(`${ip}|${ua}`)}`;
}

export async function isPremiumUser() {
  const c = await cookies();
  const email = c.get("fcai_email")?.value;
  if (!email) return false;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return false;

  if (user.isPremium) return true;
  if (user.premiumUntil && user.premiumUntil.getTime() > Date.now()) return true;

  return false;
}

export async function enforceDailyLimitOrThrow(opts: { premium: boolean; userKey: string }) {
  const FREE_LIMIT = 10;
  const PREMIUM_LIMIT = 500; // “basically unlimited” but protects you from abuse
  const limit = opts.premium ? PREMIUM_LIMIT : FREE_LIMIT;

  const dayKey = dayKeyUTC();

  const row = await db.aiUsage.upsert({
    where: { dayKey_userKey: { dayKey, userKey: opts.userKey } },
    update: { count: { increment: 1 } },
    create: { dayKey, userKey: opts.userKey, count: 1 },
  });

  if (row.count > limit) {
    const msg = opts.premium
      ? "Daily premium limit reached. Please try again tomorrow."
      : "Free daily limit reached. Upgrade to premium for more questions.";
    const err = new Error(msg) as Error & { status?: number };
    err.status = 429;
    throw err;
  }
}
