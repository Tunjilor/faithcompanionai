// src/lib/guestName.ts
import { cookies } from "next/headers";

const COOKIE = "fc_name";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]) {
  return arr[randInt(0, arr.length - 1)];
}

const ADJ = [
  "Brave",
  "Calm",
  "Bold",
  "Kind",
  "Humble",
  "Swift",
  "Wise",
  "Faithful",
  "Joyful",
  "Steady",
  "Mighty",
  "Gentle",
];

const NOUN = [
  "Lion",
  "Eagle",
  "Olive",
  "Shepherd",
  "River",
  "Cedar",
  "Lamp",
  "Anchor",
  "Compass",
  "Harbor",
  "Sparrow",
  "Dove",
];

export function sanitizeDisplayName(input: string) {
  // keep it simple and safe for URLs/sharing
  const trimmed = (input || "").trim();

  // letters/numbers/space/_- only
  const cleaned = trimmed.replace(/[^a-zA-Z0-9 _-]/g, "");

  // collapse spaces
  const collapsed = cleaned.replace(/\s+/g, " ").trim();

  // limit length
  const limited = collapsed.slice(0, 24);

  // avoid empty
  return limited || null;
}

export function makeDefaultGuestName() {
  const n = randInt(100, 999);
  return `${pick(ADJ)}${pick(NOUN)}${n}`;
}

export function getOrCreateGuestName() {
  const c = cookies();
  const existing = c.get(COOKIE)?.value;
  if (existing) return existing;

  const name = makeDefaultGuestName();
  c.set(COOKIE, name, {
    httpOnly: false, // client can read for UI
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return name;
}

export function setGuestName(name: string) {
  const clean = sanitizeDisplayName(name);
  if (!clean) return false;

  cookies().set(COOKIE, clean, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return true;
}

export function guestNameCookieKey() {
  return COOKIE;
}