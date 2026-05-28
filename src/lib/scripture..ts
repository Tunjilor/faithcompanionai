// src/lib/session.ts
import crypto from "crypto";

const SESSION_COOKIE = "fc_session";

export type SessionPayloadBase = {
  uid: string;
  exp: number;
};

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function sessionCookieName() {
  return SESSION_COOKIE;
}

export function createSessionToken(
  payload: SessionPayloadBase,
  secret: string
) {
  const body = base64url(JSON.stringify(payload));
  const sig = sign(body, secret);
  return `${body}.${sig}`;
}

// Backward-compatible alias for older imports
export const makeSessionToken = createSessionToken;

export function readSessionToken<T extends SessionPayloadBase>(
  token: string,
  secret: string
): T | null {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;

    const expected = sign(body, secret);

    const sigBuf = Buffer.from(sig, "utf8");
    const expBuf = Buffer.from(expected, "utf8");

    if (sigBuf.length !== expBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

    const json = Buffer.from(body, "base64url").toString("utf8");
    const payload = JSON.parse(json) as T;

    if (!payload?.uid || !payload?.exp) return null;
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export function makeSessionExpiry(days = 30) {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

export function defaultSessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}