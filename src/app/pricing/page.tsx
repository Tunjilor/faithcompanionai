"use client";

import { useEffect, useMemo, useState } from "react";
// If your hook lives elsewhere, adjust this import to match your project.
import usePremium from "@/components/usePremium";

type Plan = {
  id: string;
  name: string;
  priceLabel: string;
  billing: string;
  description: string;
  isSubscription: boolean;
  paypalPlanId?: string; // for subscriptions
  fallbackUrl?: string;  // optional fallback link
};

function loadPayPalSdk(clientId: string) {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
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

  // Put your PayPal client id in .env.local as NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  const plans: Plan[] = useMemo(
    () => [
      {
        id: "monthly",
        name: "Premium Monthly",
        priceLabel: "$4.99",
        billing: "per month",
        description: "Daily tools + premium quizzes + saved favorites and more.",
        isSubscription: true,
        paypalPlanId: "P-1NP76633AT433813JNFFQQMQ", // ✅ your plan id
        fallbackUrl:
          "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-1NP76633AT433813JNFFQQMQ",
      },
      // Add more plans later (yearly/lifetime) once you have their IDs.
    ],
    []
  );

  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  // Load saved email (optional)
  useEffect(() => {
    const saved = localStorage.getItem("fc_user_email");
    if (saved) setEmail(saved);
  }, []);

  // Load PayPal SDK when this page mounts
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setSdkError(null);

      if (!paypalClientId) {
        setSdkError("Missing PayPal Client ID. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env.local.");
        return;
      }

      const ok = await loadPayPalSdk(paypalClientId);
      if (cancelled) return;

      setSdkReady(ok);
      if (!ok) setSdkError("PayPal SDK failed to load (adblockers can cause this).");
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [paypalClientId]);

  // Render buttons whenever plan changes & SDK is ready
  useEffect(() => {
    if (!sdkReady) return;
    if (!selectedPlan.isSubscription) return;

    const containerId = "paypal-button-container";
    const el = document.getElementById(containerId);
    if (!el) return;

    // Clear previous buttons
    el.innerHTML = "";

    if (!window.paypal?.Buttons) {
      setSdkError("PayPal Buttons not available (SDK loaded but Buttons missing).");
      return;
    }

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
          // Save email if they provided it
          if (email) localStorage.setItem("fc_user_email", email);

          // Turn on premium locally (your existing premium logic)
          activatePremium();

          // Optional: you can show a nicer message here
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
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Pricing</h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          You’re not paying for information — you’re unlocking a guided spiritual growth experience with tools,
          structure, and community.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Plans */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Choose a plan</h2>

          <div className="mt-4 space-y-3">
            {plans.map((p) => {
              const active = p.id === selectedPlan.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p)}
                  className={[
                    "w-full text-left rounded-2xl border p-4 transition",
                    active ? "border-slate-900" : "border-slate-200 hover:border-slate-300",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-slate-600">{p.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{p.priceLabel}</div>
                      <div className="text-xs text-slate-500">{p.billing}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Checkout */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Checkout</h2>

          <label className="mt-4 block text-sm font-medium text-slate-700">Email (optional)</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
          />

          <div className="mt-5">
            {sdkError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
                <div className="text-sm text-slate-600 mb-3">
                  Secure payment via PayPal. Your premium access activates immediately after approval.
                </div>
                <div id="paypal-button-container" />
              </>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Having trouble seeing the button? Some ad blockers block PayPal scripts — the fallback link will still work.
          </p>
        </div>
      </div>
    </main>
  );
}



