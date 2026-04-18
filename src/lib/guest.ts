// src/lib/guest.ts
import crypto from "crypto";
import { cookies } from "next/headers";

const GUEST_COOKIE = "fc_guest";

export type GuestPayload = {
  v: 1;
  createdAt: number; // ms
  id: string; // random id
};

// Minimal cookie store shape we need (works with next/headers cookies())
type CookieStore = {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, opts: any) => void;
};

function sign(b64: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(b64).digest("hex");
}

export function guestCookieName() {
  return GUEST_COOKIE;
}

export function actorKeyForGuest(guestId: string) {
  return `guest:${guestId}`;
}

function getStore(store?: CookieStore): CookieStore {
  // next/headers cookies() is sync but can be awaited by callers; we keep this simple
  return (store ?? (cookies() as unknown as CookieStore)) as CookieStore;
}

export function readGuest(secret: string, store?: CookieStore): GuestPayload | null {
  const s = getStore(store);
  const token = s.get(GUEST_COOKIE)?.value;
  if (!token) return null;

  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;

  const expected = sign(b64, secret);

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const json = Buffer.from(b64, "base64url").toString("utf8");
    const payload = JSON.parse(json) as GuestPayload;
    if (!payload?.createdAt || !payload?.id) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Supports BOTH:
 *   ensureGuestCookie(secret)
 *   ensureGuestCookie(cookieStore, secret)
 */
export function ensureGuestCookie(secret: string): GuestPayload;
export function ensureGuestCookie(store: CookieStore, secret: string): GuestPayload;
export function ensureGuestCookie(a: any, b?: any): GuestPayload {
  const store: CookieStore | undefined = typeof a === "string" ? undefined : (a as CookieStore);
  const secret: string = typeof a === "string" ? (a as string) : (b as string);

  const s = getStore(store);

  const existing = readGuest(secret, s);
  if (existing) return existing;

  const payload: GuestPayload = {
    v: 1,
    createdAt: Date.now(),
    id: crypto.randomBytes(16).toString("hex"),
  };

  const b64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = sign(b64, secret);

  s.set(GUEST_COOKIE, `${b64}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return payload;
}

export function guestTrialStatus(payload: GuestPayload, trialDays = 3) {
  const ms = Date.now() - payload.createdAt;
  const days = ms / (1000 * 60 * 60 * 24);
  return {
    daysSinceFirstSeen: days,
    isWithinTrial: days < trialDays,
  };
}

const GUEST_NAME_COOKIE = "fc_name";

export function readGuestName(store?: CookieStore): string | null {
  const s = getStore(store);
  return s.get(GUEST_NAME_COOKIE)?.value ?? null;
}