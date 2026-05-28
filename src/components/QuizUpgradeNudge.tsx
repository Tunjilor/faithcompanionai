"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function QuizUpgradeNudge() {
  const [show, setShow] = useState(false);
  const user = useUser();

  useEffect(() => {
    const isPremium = user.isPremium || user.premium;
    const premiumUntil = user.premiumUntil;
    const stillActive = isPremium && (!premiumUntil || new Date(premiumUntil).getTime() > Date.now());
    if (!stillActive) setShow(true);
  }, [user]);

  if (!show) return null;

  return (
    <div className="rounded-2xl px-6 py-6 text-center" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)' }}>
      <div className="text-2xl">🎉</div>
      <h3 className="mt-2 text-xl font-extrabold text-white">You have completed today s quiz!</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/70">
        Unlock unlimited quizzes, premium categories (Theology, Church History, AI Questions),
        and AI explanations on every answer — for just <strong className="text-white">$4.99/month</strong>.
      </p>
      <Link
        href="/pricing"
        className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-8 py-3 text-sm font-bold text-white animate-pulse hover:animate-none hover:opacity-95"
      >
        Go Premium — Unlimited Access
      </Link>
      <p className="mt-3 text-xs text-white/40">Cancel anytime · Secure checkout via Stripe</p>
    </div>
  );
}
export { QuizUpgradeNudge };
