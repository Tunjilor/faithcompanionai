// src/lib/session.ts
import crypto from "crypto";

const COOKIE_NAME = "fc_session";

function hmac(input: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

export type SessionTokenPayload = {
  uid: string;
  exp: number; // ms timestamp
};

export function sessionCookieName() {
  return COOKIE_NAME;
}

export function makeSessionToken(payload: SessionTokenPayload, secret: string) {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString("base64url");
  const sig = hmac(b64, secret);
  return `${b64}.${sig}`;
}

export function readSessionToken<T>(token: string | undefined, secret: string): T | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [b64, sig] = parts;
  if (!b64 || !sig) return null;

  const expected = hmac(b64, secret);

  // timingSafeEqual requires equal-length buffers or it throws
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;

  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const json = Buffer.from(b64, "base64url").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
