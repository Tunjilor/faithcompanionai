"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type PlanId = "monthly" | "yearly" | "lifetime";

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// ✅ LIVE Stripe Payment Links (your URLs)
const STRIPE_PAYMENT_LINKS: Record<PlanId, string> = {
  lifetime: "https://buy.stripe.com/3cI28tals8Sv2zybo38Vi04",
  yearly: "https://buy.stripe.com/7sYdRb9ho8Sv7TSbo38Vi05",
  monthly: "https://buy.stripe.com/aFaeVf0KS0lZ3DCajZ8Vi06",
};

export default function PricingClient() {
  const search = useSearchParams();

  const [premium, setPremium] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // normalize params
  const success = search.get("success") === "1";
  const canceled = search.get("canceled") === "1";
  const error = search.get("error");

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setPremium(!!d?.premium))
      .catch(() => setPremium(false))
      .finally(() => setLoaded(true));
  }, []);

  const statusLabel = useMemo(() => {
    if (!loaded) return "Checking account…";
    return premium ? "Premium is active ✅" : "Free plan";
  }, [loaded, premium]);

  function goToStripe(plan: PlanId) {
    const url = STRIPE_PAYMENT_LINKS[plan];
    if (!url) return;

    // Same tab (recommended for checkout)
    window.location.href = url;

    // If you prefer new tab, use this instead:
    // window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-purple-600 to-orange-500 p-[1px]">
        <div className="rounded-3xl bg-black/35 px-6 py-10 text-center backdrop-blur">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            Pricing
          </h1>
          <p className="mt-2 text-white/80">
            Unlock premium tools, unlimited use, and AI-powered quiz packs.
          </p>
          <div className="mt-3 text-xs text-white/60">{statusLabel}</div>
        </div>
      </section>

      {/* Success / Cancel / Error banners */}
      {success && (
        <div className="fc-surface rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-white">
          <div className="font-semibold">Payment successful — you’re Premium 🎉</div>
          <div className="mt-1 text-sm text-white/80">
            Your Premium access should be active now. If it doesn’t update, refresh the page.
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/biblequiz"
              className="inline-flex items-center justify-center rounded-md bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              Take the Quiz
            </Link>
          </div>
        </div>
      )}

      {canceled && (
        <div className="fc-surface rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-white">
          <div className="font-semibold">Checkout canceled</div>
          <div className="mt-1 text-sm text-white/80">
            No charge was made. You can try again anytime.
          </div>
        </div>
      )}

      {error ? (
        <div className="fc-surface rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-white">
          <div className="font-semibold">Something went wrong</div>
          <div className="mt-1 text-sm text-white/80">Error code: {error}</div>
        </div>
      ) : null}

      {/* Already premium */}
      {premium ? (
        <div className="fc-surface rounded-2xl p-6">
          <div className="text-xl font-extrabold text-white">You’re Premium ✅</div>
          <p className="mt-2 text-white/70">
            You have unlimited access to tools and premium quiz categories.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/biblequiz"
              className="rounded-md border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
            >
              Take the Quiz
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Pricing cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Free */}
            <div className="fc-surface rounded-2xl p-6">
              <div className="text-sm font-semibold text-white/70">Free</div>
              <div className="mt-2 text-3xl font-extrabold text-white">$0</div>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>• Daily verses, prayers, devotionals (limited)</li>
                <li>• 3 quizzes/day</li>
                <li>• Standard categories</li>
              </ul>
              <div className="mt-5">
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white"
                >
                  Continue Free
                </Link>
              </div>
            </div>

            {/* Monthly */}
            <div className="fc-surface rounded-2xl border border-orange-500/30 bg-white/[0.03] p-6">
              <div className="text-sm font-semibold text-orange-300">Monthly</div>
              <div className="mt-2 text-3xl font-extrabold text-white">$4.99</div>
              <div className="mt-1 text-sm text-white/60">per month</div>
              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>• Unlimited tools</li>
                <li>• Unlimited quizzes</li>
                <li>• Premium quiz packs (AI / Theology / History)</li>
              </ul>
              <div className="mt-5">
                <button
                  type="button"
                  disabled={!loaded}
                  onClick={() => goToStripe("monthly")}
                  className={classNames(
                    "w-full rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white hover:opacity-95",
                    !loaded && "opacity-60"
                  )}
                >
                  {loaded ? "Go Monthly" : "Checking…"}
                </button>
              </div>
              <div className="mt-2 text-xs text-white/45">
                Auto-renews • Cancel anytime
              </div>
            </div>

            {/* Yearly / Lifetime */}
            <div className="fc-surface rounded-2xl p-6">
              <div className="text-sm font-semibold text-white/70">
                Yearly / Lifetime
              </div>
              <div className="mt-2 grid gap-3">
                <button
                  type="button"
                  disabled={!loaded}
                  onClick={() => goToStripe("yearly")}
                  className={classNames(
                    "rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white",
                    !loaded && "opacity-60"
                  )}
                >
                  Go Yearly
                </button>

                <button
                  type="button"
                  disabled={!loaded}
                  onClick={() => goToStripe("lifetime")}
                  className={classNames(
                    "rounded-md border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-500/15",
                    !loaded && "opacity-60"
                  )}
                >
                  Get Lifetime
                </button>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-white/75">
                <li>• Best value plans</li>
                <li>• Premium quiz packs included</li>
                <li>• Priority updates</li>
              </ul>

              <div className="mt-2 text-xs text-white/45">
                Note: Lifetime is a one-time payment (no renewal).
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="fc-surface rounded-2xl p-6 text-sm text-white/70">
            Premium unlocks the AI quiz categories and removes daily limits. Your premium status is verified
            server-side via your session cookie (no localStorage hacks).
          </div>
        </>
      )}
    </div>
  );
}
