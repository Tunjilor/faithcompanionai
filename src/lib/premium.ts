// src/lib/premium.ts
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";
import { sha256, dayKeyUTC } from "@/lib/hash";
import { readSessionToken, sessionCookieName } from "@/lib/session";
import { ensureGuestCookie, actorKeyForGuest } from "@/lib/guest";

type SessionPayload = {
  uid: string;
  exp: number;
};

type SessionUser = {
  id: string;
  email: string;
  isPremium: boolean;
  premiumUntil: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

function makeHttpError(
  message: string,
  status: number,
  code?: string
): Error & { status: number; code?: string } {
  const err = new Error(message) as Error & { status: number; code?: string };
  err.status = status;
  err.code = code;
  return err;
}

function quotaError(message: string) {
  return makeHttpError(message, 429, "LIMIT_REACHED");
}

function authError(message = "Unauthorized") {
  return makeHttpError(message, 401, "UNAUTHORIZED");
}

function premiumError(message = "Premium required") {
  return makeHttpError(message, 403, "PREMIUM_REQUIRED");
}

export function isUserPremium(user: {
  isPremium: boolean;
  premiumUntil: Date | null;
}) {
  if (!user.isPremium) return false;
  if (user.premiumUntil === null) return true;
  return user.premiumUntil.getTime() > Date.now();
}

/**
 * Stable-ish anonymous key fallback.
 * Useful only as a secondary anonymous signal.
 */
export function getAnonymousFallbackKey() {
  const h = headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown-ip";
  const ua = h.get("user-agent") || "unknown-ua";
  return `anon:${sha256(`${ip}|${ua}`)}`;
}

/**
 * Reads fc_session, verifies it, returns DB user or null.
 */
export async function getUserFromSession(): Promise<SessionUser | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  const token = cookies().get(sessionCookieName())?.value;
  if (!token) return null;

  const payload = readSessionToken<SessionPayload>(token, secret);
  if (!payload) return null;
  if (Date.now() > payload.exp) return null;

  const user = await db.user.findUnique({
    where: { id: payload.uid },
    select: {
      id: true,
      email: true,
      isPremium: true,
      premiumUntil: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  });

  return user ?? null;
}

export async function requireUserFromSession() {
  const user = await getUserFromSession();
  if (!user) {
    throw authError("You must be signed in.");
  }
  return user;
}

export async function isPremiumUser() {
  const user = await getUserFromSession();
  if (!user) return false;
  return isUserPremium(user);
}

export async function requirePremiumUserFromSession() {
  const user = await requireUserFromSession();
  if (!isUserPremium(user)) {
    throw premiumError("Premium required to save content.");
  }
  return user;
}

/**
 * Generic daily limiter by hashed user key.
 */
export async function enforceDailyLimitOrThrow(opts: {
  premium: boolean;
  userKey: string;
}) {
  const FREE_LIMIT = 10;
  const PREMIUM_LIMIT = 500;
  const limit = opts.premium ? PREMIUM_LIMIT : FREE_LIMIT;
  const dayKey = dayKeyUTC();

  const existing = await db.aiUsage.findUnique({
    where: { dayKey_userKey: { dayKey, userKey: opts.userKey } },
  });

  const todayCount = existing?.count ?? 0;

  if (todayCount >= limit) {
    throw quotaError(
      opts.premium
        ? "Daily premium limit reached. Please try again tomorrow."
        : "Free daily limit reached. Upgrade to premium for more questions."
    );
  }

  await db.aiUsage.upsert({
    where: { dayKey_userKey: { dayKey, userKey: opts.userKey } },
    update: { count: { increment: 1 } },
    create: { dayKey, userKey: opts.userKey, count: 1 },
  });
}

/**
 * Main ask quota enforcement.
 *
 * Rules:
 * - Premium signed-in users: high daily limit
 * - Signed-in free users: 10/day
 * - Guests: 10/day, 30 total, max 3 distinct usage days
 */
export async function enforceAskQuotaFromSessionOrThrow() {
  const dayKey = dayKeyUTC();

  const user = await getUserFromSession();
  if (user) {
    const premium = isUserPremium(user);

    await enforceDailyLimitOrThrow({
      premium,
      userKey: `uid:${sha256(user.id)}`,
    });

    return {
      kind: premium ? "premium_user" : "free_user",
      softUpsell: !premium,
    } as const;
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is missing.");
  }

  const cookieStore = cookies();
  const guest = ensureGuestCookie(cookieStore as any, secret);
  const userKey = actorKeyForGuest(guest.id);

  const rows = await db.aiUsage.findMany({
    where: { userKey },
    select: { dayKey: true, count: true },
    orderBy: { dayKey: "asc" },
  });

  const todayRow = rows.find((r) => r.dayKey === dayKey);
  const todayCount = todayRow?.count ?? 0;
  const totalCount = rows.reduce((sum, r) => sum + r.count, 0);
  const distinctDaysUsed = rows.length;

  if (totalCount >= 30) {
    throw quotaError(
      "Your free guest trial has ended. Create an account or upgrade to continue."
    );
  }

  if (todayCount >= 10) {
    throw quotaError(
      "You’ve used your 10 free questions for today. Come back tomorrow or upgrade for more."
    );
  }

  if (todayCount === 0 && distinctDaysUsed >= 3) {
    throw quotaError(
      "You’ve used all 3 free trial days. Create an account or upgrade to continue."
    );
  }

  await db.aiUsage.upsert({
    where: { dayKey_userKey: { dayKey, userKey } },
    update: { count: { increment: 1 } },
    create: { dayKey, userKey, count: 1 },
  });

  const nextTodayUsed = todayCount + 1;
  const nextTotalUsed = totalCount + 1;
  const nextDistinctDaysUsed =
    todayCount === 0 ? distinctDaysUsed + 1 : distinctDaysUsed;

  const softUpsell =
    nextTodayUsed >= 7 || nextTotalUsed >= 20 || nextDistinctDaysUsed >= 3;

  return {
    kind: "guest",
    softUpsell,
    quota: {
      todayUsed: nextTodayUsed,
      todayLimit: 10,
      totalUsed: nextTotalUsed,
      totalLimit: 30,
      daysUsed: nextDistinctDaysUsed,
      daysLimit: 3,
    },
  } as const;
}