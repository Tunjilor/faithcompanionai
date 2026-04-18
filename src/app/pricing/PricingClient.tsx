// src/app/pricing/PricingClient.tsx
"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePremium } from "@/components/usePremium";

type PlanId = "monthly" | "yearly" | "lifetime";

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Stripe Payment Links
const STRIPE_PAYMENT_LINKS: Record<PlanId, string> = {
  lifetime: "https://buy.stripe.com/3cI28tals8Sv2zybo38Vi04",
  yearly: "https://buy.stripe.com/7sYdRb9ho8Sv7TSbo38Vi05",
  monthly: "https://buy.stripe.com/aFaeVf0KS0lZ3DCajZ8Vi06",
};

function decodeParam(value: string | null) {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default function PricingClient() {
  const search = useSearchParams();
  const { isPremium: premium, loading, refresh, me } = usePremium();

  const status = search.get("status");
  const message = decodeParam(search.get("message"));

  const success = status === "success";
  const canceled =
    status === "canceled" ||
    status === "cancelled" ||
    search.get("canceled") === "1";
  const error = status === "error" ? message || "unknown_error" : null;

  useEffect(() => {
    if (success) {
      refresh();
    }
  }, [success, refresh]);

  const statusLabel = useMemo(() => {
    if (loading) return "Checking account…";
    return premium ? "Premium is active ✅" : "Free plan";
  }, [loading, premium]);

  function goToStripe(plan: PlanId) {
    const url = STRIPE_PAYMENT_LINKS[plan];
    if (!url) return;
    window.location.href = url;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-purple-600 to-orange-500 p-[1px]">
        <div className="rounded-3xl bg-black/35 px-6 py-10 text-center backdrop-blur">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            Pricing
          </h1>
          <p className="mt-2 text-white/80">
            Unlock premium tools, unlimited use, and AI-powered quiz packs.
          </p>
          <div className="mt-3 text-xs text-white/60">{statusLabel}</div>

          {!loading && me?.email ? (
            <div className="mt-2 text-xs text-white/45">
              Signed in as {me.email}
            </div>
          ) : null}
        </div>
      </section>

      {success && (
        <div className="rounded-2xl border border-white/25 bg-white/15 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-white">
          <div className="font-semibold">Payment successful — welcome 🎉</div>
          <div className="mt-1 text-sm text-white/80">
            Your Premium access should activate automatically. If you do not
            see “Premium is active ✅” above yet, refresh this page once or go
            to your dashboard.
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
        <div className="rounded-2xl border border-white/25 bg-white/15 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-white">
          <div className="font-semibold">Checkout canceled</div>
          <div className="mt-1 text-sm text-white/80">
            No charge was made. You can try again anytime.
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-white/25 bg-white/15 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-white">
          <div className="font-semibold">Something went wrong</div>
          <div className="mt-1 text-sm text-white/80">
            Error: {error}
          </div>
        </div>
      )}

      {premium ? (
        <div className="rounded-2xl border border-white/25 bg-white/15 rounded-2xl p-6">
          <div className="text-xl font-extrabold text-white">
            You’re Premium ✅
          </div>
          <p className="mt-2 text-white/70">
            You have unlimited access to tools and premium quiz categories.
          </p>

          {me?.premiumUntil ? (
            <div className="mt-2 text-xs text-white/45">
              Premium until: {me.premiumUntil}
            </div>
          ) : (
            <div className="mt-2 text-xs text-white/45">
              Active plan: Lifetime or ongoing premium access
            </div>
          )}

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Free */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div className="text-sm font-semibold text-white">Free</div>
              <div className="mt-2 text-3xl font-extrabold text-white">$0</div>
              <div className="mt-1 text-sm text-white">forever</div>
              <ul className="mt-4 space-y-2 text-sm text-white">
                <li>• Daily verses, prayers & devotionals</li>
                <li>• Bible quiz (free categories)</li>
                <li>• No account required</li>
              </ul>
              <div className="mt-5">
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-md border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Continue Free
                </Link>
              </div>
            </div>

            {/* Monthly */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(139, 92, 246, 0.25)', border: '1px solid rgba(139, 92, 246, 0.5)' }}>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-orange-300">Monthly</div>
                <div className="rounded-full bg-orange-500/30 px-2 py-0.5 text-xs font-bold text-orange-200">
                  Popular
                </div>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-white">$4.99</div>
              <div className="mt-1 text-sm text-white">per month</div>
              <ul className="mt-4 space-y-2 text-sm text-white">
                <li>• Unlimited tools & quizzes</li>
                <li>• All premium quiz categories</li>
                <li>• Save to faith journal</li>
              </ul>
              <div className="mt-5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => goToStripe("monthly")}
                  className={classNames(
                    "w-full rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white hover:opacity-95",
                    loading && "opacity-60"
                  )}
                >
                  {loading ? "Checking…" : "Go Monthly"}
                </button>
              </div>
              <div className="mt-2 text-xs text-white/70">Auto-renews • Cancel anytime</div>
            </div>

            {/* Yearly */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(249, 115, 22, 0.25)', border: '1px solid rgba(249, 115, 22, 0.5)' }}>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-violet-300">Yearly</div>
                <div className="rounded-full bg-violet-500/30 px-2 py-0.5 text-xs font-bold text-violet-200">
                  Save 33%
                </div>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-white">$39.99</div>
              <div className="mt-1 text-sm text-white">per year</div>
              <ul className="mt-4 space-y-2 text-sm text-white">
                <li>• Everything in Monthly</li>
                <li>• Better value for daily users</li>
                <li>• ~$3.33/month billed yearly</li>
              </ul>
              <div className="mt-5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => goToStripe("yearly")}
                  className={classNames(
                    "w-full rounded-md bg-gradient-to-r from-violet-600 to-purple-500 px-4 py-3 text-sm font-semibold text-white hover:opacity-95",
                    loading && "opacity-60"
                  )}
                >
                  {loading ? "Checking…" : "Go Yearly"}
                </button>
              </div>
              <div className="mt-2 text-xs text-white/70">Auto-renews • Cancel anytime</div>
            </div>

            {/* Lifetime */}
            <div className="rounded-2xl p-6" style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid rgba(16, 185, 129, 0.5)' }}>
              <div className="text-sm font-semibold text-white">Lifetime</div>
              <div className="mt-2 text-3xl font-extrabold text-white">$79.99</div>
              <div className="mt-1 text-sm text-white">one-time payment</div>
              <ul className="mt-4 space-y-2 text-sm text-white">
                <li>• Everything in Monthly</li>
                <li>• No renewals ever</li>
                <li>• Best for early supporters</li>
              </ul>
              <div className="mt-5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => goToStripe("lifetime")}
                  className={classNames(
                    "w-full rounded-md border border-orange-400 bg-orange-500/20 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-500/30",
                    loading && "opacity-60"
                  )}
                >
                  {loading ? "Checking…" : "Get Lifetime"}
                </button>
              </div>
              <div className="mt-2 text-xs text-white/70">One payment, permanent access</div>
            </div>
          </div>

          <div className="rounded-2xl p-6 text-sm text-white" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
            Payments are processed securely by Stripe. Premium access is
            verified server-side.
          </div>
        </>
      )}
    </div>
  );
}