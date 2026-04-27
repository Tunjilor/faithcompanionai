// src/components/home/HomeCtaLayer.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MeResponse = {
  signedIn?: boolean;
  authed?: boolean;
  isPremium?: boolean;
  premium?: boolean;
  premiumUntil?: string | null;
  email?: string | null;
  guest?: {
    trial?: {
      daysSinceFirstSeen?: number;
      isWithinTrial?: boolean;
    };
  } | null;
};

function isPremiumActive(me: MeResponse | null) {
  const premiumFlag = !!(me?.isPremium ?? me?.premium);
  if (!premiumFlag) return false;
  if (!me?.premiumUntil) return true;
  return new Date(me.premiumUntil).getTime() > Date.now();
}

export default function HomeCtaLayer() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        const data = res.ok ? await res.json() : null;
        if (!cancelled) setMe(data);
      } catch {
        if (!cancelled) setMe(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMe();
    return () => {
      cancelled = true;
    };
  }, []);

  const signedIn = !!(me?.signedIn ?? me?.authed);
  const premiumActive = isPremiumActive(me);

  const guestLabel = useMemo(() => {
    const days = me?.guest?.trial?.daysSinceFirstSeen;
    if (typeof days !== "number") return null;
    return `Guest trial in progress`;
  }, [me]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/biblequiz"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Start Your Faith Journey
        </Link>
      </div>
    );
  }

  if (premiumActive) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-emerald-300">
          Premium is active{me?.email ? ` for ${me.email}` : ""}.
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Open Dashboard
          </Link>

          <Link
            href="/tools/devotional"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Go Deeper with Devotional
          </Link>
        </div>
      </div>
    );
  }

  if (signedIn) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-white/65">
          Signed in{me?.email ? ` as ${me.email}` : ""}. Keep exploring free, or unlock the full faith journal with Premium.
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/tools/verse"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Continue Free
          </Link>

          <Link
            href="/pricing"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {guestLabel && <div className="text-sm text-white/60">{guestLabel}</div>}

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/biblequiz"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Start Your Faith Journey
        </Link>

        <Link
          href="/login"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Create Free Account
        </Link>
      </div>
    </div>
  );
}