"use client";

import { useEffect, useMemo, useState } from "react";
import { usePremium } from "@/components/usePremium";

type Plan = {
  id: string;
  name: string;
  priceLabel: string;
  billing: string;
  description: string;
  isSubscription: boolean;
  paypalPlanId?: string;
  fallbackUrl?: string;
};

function loadPayPalSdk(clientId: string) {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    // @ts-ignore
    if (window.paypal) return resolve(true);

    const existing = document.getElementById("paypal-sdk");
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PricingPage() {
  const { activatePremium } = usePremium();

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  const plans: Plan[] = useMemo(
    () => [
      {
        id: "monthly",
        name: "Premium Monthly",
        priceLabel: "$4.99",
        billing: "per month",
        description:
          "Daily tools + premium quizzes + saved favorites and more.",
        isSubscription: true,
        paypalPlanId: "P-1NP76633AT433813JNFFQQMQ",
        fallbackUrl:
          "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-1NP76633AT433813JNFFQQMQ",
      },
    ],
    []
  );

  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("fc_user_email");
    if (saved) setEmail(saved);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setSdkError(null);

      if (!paypalClientId) {
        setSdkError(
          "Missing PayPal Client ID. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env.local."
        );
        return;
      }

      const ok = await loadPayPalSdk(paypalClientId);
      if (cancelled) return;

      setSdkReady(ok);
      if (!ok)
        setSdkError("PayPal SDK failed to load (ad blockers can cause this).");
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [paypalClientId]);

  useEffect(() => {
    if (!sdkReady) return;
    if (!selectedPlan.isSubscription) return;

    const containerId = "paypal-button-container";
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = "";

    // @ts-ignore
    if (!window.paypal?.Buttons) {
      setSdkError(
        "PayPal Buttons not available (SDK loaded but Buttons missing)."
      );
      return;
    }

    // @ts-ignore
    window.paypal
      .Buttons({
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "subscribe",
        },
        createSubscription: (_data: any, actions: any) => {
          return actions.subscription.create({
            plan_id: selectedPlan.paypalPlanId,
          });
        },
        onApprove: async (data: any) => {
          if (email) localStorage.setItem("fc_user_email", email);
          activatePremium();
          alert(`Subscribed! Subscription ID: ${data.subscriptionID}`);
        },
        onError: (err: any) => {
          console.error(err);
          setSdkError("PayPal error while rendering the button.");
        },
      })
      .render(`#${containerId}`);
  }, [sdkReady, selectedPlan, email, activatePremium]);

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Pricing</h1>
        <p className="mt-2 max-w-2xl text-white/70">
          You’re not paying for information — you’re unlocking a guided spiritual
          growth experience with tools, structure, and community.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Plans */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">Choose a plan</h2>

          <div className="mt-4 space-y-3">
            {plans.map((p) => {
              const active = p.id === selectedPlan.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p)}
                  className={[
                    "w-full text-left rounded-2xl border p-4 transition",
                    active
                      ? "border-white/30 bg-white/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-sm text-white/70">
                        {p.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">
                        {p.priceLabel}
                      </div>
                      <div className="text-xs text-white/60">{p.billing}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div className="font-semibold text-white">Included</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Daily Verse + reflections</li>
              <li>Prayer + Devotional tools</li>
              <li>Favorites & saved history</li>
              <li>Community features (Prayer Wall)</li>
            </ul>
          </div>
        </div>

        {/* Checkout */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">Checkout</h2>

          <label className="mt-4 block text-sm font-medium text-white/70">
            Email (optional)
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/10"
          />

          <div className="mt-5">
            {sdkError ? (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
                {sdkError}
                {selectedPlan.fallbackUrl ? (
                  <div className="mt-3">
                    <a
                      className="underline font-medium"
                      href={selectedPlan.fallbackUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Continue with PayPal (fallback link)
                    </a>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <div className="mb-3 text-sm text-white/70">
                  Secure payment via PayPal. Premium access activates after
                  approval.
                </div>
                <div id="paypal-button-container" />
              </>
            )}
          </div>

          <p className="mt-4 text-xs text-white/50">
            If you don’t see the button, some ad blockers block PayPal scripts —
            use the fallback link.
          </p>
        </div>
      </div>
    </div>
  );
}
