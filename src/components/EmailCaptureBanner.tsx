// src/components/EmailCaptureBanner.tsx
"use client";

import { useState } from "react";

export default function EmailCaptureBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "quiz-results" }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl px-6 py-5 text-center text-sm font-semibold text-emerald-300" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
        ✅ You're in! Check your inbox for your first daily verse.
      </div>
    );
  }

  return (
    <div className="rounded-2xl px-6 py-5" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-base font-bold text-white">
            Get your daily Bible verse by email — free forever
          </div>
          <div className="mt-1 text-sm text-white/60">
            One verse, one prayer, every morning. No spam. Unsubscribe anytime.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex shrink-0 gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-48 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? "…" : "Subscribe"}
          </button>
        </form>
      </div>

      {status === "error" && (
        <p className="mt-2 text-xs text-red-400">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
export { EmailCaptureBanner };
