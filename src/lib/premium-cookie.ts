import crypto from "crypto";

const COOKIE_SECRET = process.env.PREMIUM_COOKIE_SECRET || "";

type PremiumPayload = {
  v: 1;
  customerId?: string;
  premium: boolean;
  plan: "monthly" | "yearly" | "lifetime" | "unknown";
  exp?: number; // unix seconds (optional)
  iat: number; // unix seconds
};

function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function unb64url(input: string) {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4 ? 4 - (input.length % 4) : 0;
  return Buffer.from(input + "=".repeat(pad), "base64");
}

function sign(data: string) {
  if (!COOKIE_SECRET) return "";
  return b64url(crypto.createHmac("sha256", COOKIE_SECRET).update(data).digest());
}

export function makePremiumToken(payload: Omit<PremiumPayload, "v" | "iat">) {
  const full: PremiumPayload = {
    v: 1,
    iat: Math.floor(Date.now() / 1000),
    ...payload,
  };
  const body = b64url(JSON.stringify(full));
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function readPremiumToken(token?: string | null): PremiumPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = sign(body);
  if (!expected) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  try {
    const json = unb64url(body).toString("utf8");
    const payload = JSON.parse(json) as PremiumPayload;

    if (payload?.v !== 1) return null;
    if (!payload.premium) return payload;

    // If exp exists, ensure it’s not expired
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return { ...payload, premium: false };
    }

    return payload;
  } catch {
    return null;
  }
}
