// src/app/quiz/challenge/ChallengeClient.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function cleanName(value: string | null) {
  const raw = (value || "").trim();
  if (!raw) return "Someone";
  return raw.slice(0, 40);
}

function cleanScore(value: string | null) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return "?";
  return String(Math.floor(n));
}

export default function ChallengeClient() {
  const sp = useSearchParams();

  const userName = cleanName(sp.get("u"));
  const score = cleanScore(sp.get("s"));
  const total = cleanScore(sp.get("t"));

  const title = useMemo(
    () => `${userName} scored ${score}/${total} — can you beat it?`,
    [userName, score, total]
  );

  const subtitle = useMemo(() => {
    if (score === "?" || total === "?") {
      return "Take the Faith Companion AI Bible quiz and see how well you know Scripture.";
    }

    return `Take the Faith Companion AI Bible quiz and see if you can beat ${userName}'s score.`;
  }, [userName, score, total]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 text-center shadow-2xl backdrop-blur md:p-10">
        <div className="mx-auto max-w-2xl">
          <div className="inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200">
            Bible Quiz Challenge
          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight text-white md:text-5xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75 md:text-base">
            {subtitle}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/biblequiz"
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Take the Quiz
            </Link>

            <Link
              href="/pricing"
              className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Go Premium
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <h2 className="text-sm font-semibold text-white">Why challenge a friend?</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
              <li>• Make Bible learning more fun and social</li>
              <li>• Compare scores and invite friendly competition</li>
              <li>• Spend more time learning Scripture together</li>
            </ul>
          </div>

          <div className="mt-6 text-xs text-white/40">
            Tip: set your display name on the quiz page before sharing your score.
          </div>
        </div>
      </section>
    </main>
  );
}