// src/lib/stripe.ts
import Stripe from "stripe";

const globalForStripe = globalThis as unknown as { stripe?: Stripe };

function requireStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Fail fast in runtime (but won't execute at build unless code is imported)
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return key;
}

export const stripe =
  globalForStripe.stripe ??
  new Stripe(requireStripeSecretKey(), {
    // ✅ Do NOT set apiVersion here to avoid TS mismatches between Stripe package versions
    // Stripe will use the SDK default API version.
  });

if (process.env.NODE_ENV !== "production") {
  globalForStripe.stripe = stripe;
}