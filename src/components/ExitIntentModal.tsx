"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

const SESSION_KEY = "fcai_exit_intent_shown";

export default function ExitIntentModal() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useUser();

  useEffect(() => {
    setMounted(true);
    const alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadyShown) return;

    let fired = false;
    function handleMouseLeave(e: MouseEvent) {
      if (fired || e.clientY > 40) return;
      fired = true;
      sessionStorage.setItem(SESSION_KEY, "1");
      const isPremium = user.isPremium || user.premium;
      const premiumUntil = user.premiumUntil;
      const stillActive = isPremium && (!premiumUntil || new Date(premiumUntil).getTime() > Date.now());
      if (!stillActive) setVisible(true);
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [user]);

  if (!mounted || !visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl shadow-2xl" style={{ background: 'rgba(10,8,20,0.97)', border: '1px solid rgba(168,85,247,0.4)' }}>
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 to-orange-500" />
        <div className="px-8 py-8 text-center">
          <div className="text-3xl">✋</div>
          <h2 className="mt-3 text-2xl font-extrabold text-white">Before you go…</h2>
          <p className="mt-2 text-lg font-semibold text-orange-300">You have 2 free quizzes left this week</p>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Upgrade to Premium and never hit a limit again. Unlimited quizzes,
            all 6 categories, AI explanations, and your personal faith journal —
            starting at just $4.99/month.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/pricing"
              onClick={() => setVisible(false)}
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 text-sm font-bold text-white hover:opacity-95"
            >
              Go Premium — $4.99/month
            </Link>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="text-sm text-white/40 hover:text-white/70"
            >
              No thanks, continue free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export { ExitIntentModal };
