// src/lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // Do NOT set apiVersion here — let Stripe use your account's version.
});
