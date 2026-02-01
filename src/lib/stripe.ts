// src/lib/stripe.ts
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Important: fail fast, but only when actually used.
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  }

  _stripe = new Stripe(key, {
    apiVersion: "2025-12-15.clover",
  });

  return _stripe;
}
