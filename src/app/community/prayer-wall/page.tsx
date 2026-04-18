// src/app/community/prayer-wall/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Prayer = {
  id: string;
  name: string | null;
  text: string;
  prayCount: number;
  createdAt: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export default function PrayerWallPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Track which prayers this session already prayed for (prevent double-count)
  const prayedSet = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadPrayers();
  }, []);

  async function loadPrayers() {
    setLoading(true);
    try {
      const res = await fetch("/api/prayer-requests", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok && Array.isArray(data?.prayers)) {
        setPrayers(data.prayers);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (text.trim().length < 5) {
      setFormError("Please write at least a few words about what you need prayer for.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim() || null, text: text.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(data?.error || "Could not submit. Please try again.");
        return;
      }
      // Prepend to list
      setPrayers((prev) => [data.prayer, ...prev]);
      setText("");
      setName("");
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 3000);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePray(id: string) {
    if (prayedSet.current.has(id)) return; // already prayed this session
    prayedSet.current.add(id);

    // Optimistic update
    setPrayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, prayCount: p.prayCount + 1 } : p))
    );

    try {
      await fetch(`/api/prayer-requests/${id}/pray`, { method: "POST" });
    } catch {
      // Revert on failure
      prayedSet.current.delete(id);
      setPrayers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, prayCount: p.prayCount - 1 } : p))
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
          Community · Prayer Wall
        </div>
        <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">
          Prayer Wall
        </h1>
        <p className="mt-3 text-sm leading-7 text-white/65 md:text-base">
          Share what you're believing for. Anyone can pray — no account needed.
          Every request is met with real people praying.
        </p>
      </header>

      {/* Submit form */}
      <section className="rounded-[24px] p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 className="text-lg font-bold text-white">Submit a prayer request</h2>
        <p className="mt-1 text-sm text-white/50">
          Share what's on your heart. Posts are public. Max 200 characters.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-1">
              Your name (optional)
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="Anonymous"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/25"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/60 mb-1">
              Prayer request <span className="text-white/30">({text.length}/200)</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 200))}
              rows={4}
              placeholder="Share what you need prayer for…"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/25"
            />
          </div>

          {formError && (
            <p className="text-sm text-red-400">{formError}</p>
          )}

          {formSuccess && (
            <p className="text-sm text-emerald-400">
              🙏 Your prayer request has been submitted. We're believing with you.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || text.trim().length < 5}
            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-40 transition"
          >
            {submitting ? "Submitting…" : "Post prayer request"}
          </button>
        </form>
      </section>

      {/* Prayer feed */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Community prayers</h2>
          {!loading && (
            <span className="text-xs text-white/40">{prayers.length} requests</span>
          )}
        </div>

        {loading ? (
          <div className="rounded-[22px] p-6 text-sm text-white/50" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Loading prayers…
          </div>
        ) : prayers.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-white/10 bg-black/10 p-8 text-center text-sm text-white/40">
            No prayer requests yet. Be the first to share.
          </div>
        ) : (
          <div className="space-y-4">
            {prayers.map((prayer) => {
              const alreadyPrayed = prayedSet.current.has(prayer.id);
              return (
                <article
                  key={prayer.id}
                  className="rounded-[22px] p-5"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span className="font-semibold text-white/60">
                          {prayer.name || "Anonymous"}
                        </span>
                        <span>·</span>
                        <time dateTime={prayer.createdAt}>{timeAgo(prayer.createdAt)}</time>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/80">{prayer.text}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handlePray(prayer.id)}
                      disabled={alreadyPrayed}
                      className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        alreadyPrayed
                          ? "bg-emerald-500/20 text-emerald-300 cursor-default"
                          : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      🙏{" "}
                      {alreadyPrayed ? "Praying" : "I'm praying for this"}
                      {prayer.prayCount > 0 && (
                        <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          alreadyPrayed ? "bg-emerald-500/30 text-emerald-200" : "bg-white/10 text-white/60"
                        }`}>
                          {prayer.prayCount}
                        </span>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer links */}
      <div className="mt-10 flex flex-wrap gap-4 text-sm text-white/40">
        <Link href="/community" className="hover:text-white">← Community</Link>
        <Link href="/tools/prayer" className="hover:text-white">Generate a personal prayer →</Link>
      </div>
    </div>
  );
}
