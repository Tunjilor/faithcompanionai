// src/lib/stripe.ts
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // IMPORTANT: don't crash build time; crash only if this route is actually hit
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  }

  _stripe = new Stripe(key, {
    apiVersion: "2024-06-20",
  });

  return _stripe;
}
