// src/lib/magicLink.ts
import crypto from "crypto";

type MagicPayload = {
  v: 1;
  email: string;
  exp: number; // ms
  nonce: string;
};

function hmac(input: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

export function makeMagicLinkToken(emailRaw: string, secret: string, ttlMinutes = 15) {
  const email = emailRaw.toLowerCase().trim();
  const payload: MagicPayload = {
    v: 1,
    email,
    exp: Date.now() + ttlMinutes * 60 * 1000,
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const b64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = hmac(b64, secret);
  return `${b64}.${sig}`;
}

export function readMagicLinkToken(token: string | undefined, secret: string): MagicPayload | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;

  const expected = hmac(b64, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  try {
    const json = Buffer.from(b64, "base64url").toString("utf8");
    const payload = JSON.parse(json) as MagicPayload;
    if (!payload?.email || !payload?.exp) return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}