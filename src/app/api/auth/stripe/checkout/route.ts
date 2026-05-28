import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlanId = "monthly" | "yearly" | "lifetime";

function getPriceId(plan: PlanId) {
  if (plan === "monthly") return process.env.STRIPE_PRICE_MONTHLY;
  if (plan === "yearly") return process.env.STRIPE_PRICE_YEARLY;
  return process.env.STRIPE_PRICE_LIFETIME;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const plan = (url.searchParams.get("plan") || "monthly") as PlanId;

  const redirect = url.searchParams.get("redirect") || "/pricing?success=1";
  const origin = url.origin;

  const priceId = getPriceId(plan);
  if (!priceId) {
    return NextResponse.redirect(
      new URL(`/pricing?error=missing_price_${plan}`, origin)
    );
  }

  const mode: "payment" | "subscription" = plan === "lifetime" ? "payment" : "subscription";

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,

      // Helpful for debugging + webhook processing
      metadata: {
        plan,
      },

      success_url: `${origin}/api/auth/stripe/complete?session_id={CHECKOUT_SESSION_ID}&redirect=${encodeURIComponent(
        redirect
      )}`,
      cancel_url: `${origin}/pricing?canceled=1`,
    });

    return NextResponse.redirect(session.url!);
  } catch (err: any) {
    const msg = encodeURIComponent(err?.message || "checkout_failed");
    return NextResponse.redirect(new URL(`/pricing?error=${msg}`, origin));
  }
}