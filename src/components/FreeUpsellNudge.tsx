"use client";

import Link from "next/link";

export function FreeUpsellNudge({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="mt-4 flex items-start justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
      <p className="text-xs leading-relaxed text-slate-400">
        You&apos;re always welcome here.{" "}
        <Link
          href="/pricing"
          className="font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700 transition-colors"
        >
          Premium
        </Link>{" "}
        unlocks deeper reflections, action steps, and your personal faith journal.{" "}
        <Link
          href="/pricing"
          className="text-slate-500 underline underline-offset-2 hover:text-slate-700 transition-colors"
        >
          Learn more
        </Link>
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="mt-0.5 shrink-0 text-slate-300 transition-colors hover:text-slate-500 text-base leading-none"
      >
        ×
      </button>
    </div>
  );
}
