// src/lib/stripe.ts
import Stripe from "stripe";

/**
 * Server-side Stripe client (Node runtime).
 * Used by API routes like:
 *   import { stripe } from "@/lib/stripe";
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2023-10-16",
});

/**
 * Optional default export if any file uses:
 *   import stripe from "@/lib/stripe";
 */
export default stripe;
