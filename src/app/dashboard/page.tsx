// src/app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import UpgradeCTA from "@/components/UpgradeCTA";

// ── Types ────────────────────────────────────────────────────────────────────

type MeResponse = {
  signedIn?: boolean;
  authed?: boolean;
  isPremium?: boolean;
  premium?: boolean;
  premiumUntil?: string | null;
  email?: string | null;
  actorKey?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  guest?: {
    id?: string;
    createdAt?: number;
    trial?: { daysSinceFirstSeen?: number; isWithinTrial?: boolean };
  } | null;
};

type SavedItem = {
  id: string;
  type: "answer" | "prayer" | "verse" | "plan_note";
  title: string | null;
  content: string;
  reference: string | null;
  createdAt: string;
  answeredAt: string | null;
  answerNote: string | null;
};

type StreakData = {
  currentStreak: number;
  longestStreak: number;
  isNewDay: boolean;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function isPremiumActive(me: MeResponse | null) {
  const premiumFlag = !!(me?.isPremium ?? me?.premium);
  if (!premiumFlag) return false;
  if (!me?.premiumUntil) return true;
  return new Date(me.premiumUntil).getTime() > Date.now();
}

function formatDate(input: string) {
  return new Date(input).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(text: string, max = 200) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

// ── Prayer Journal card ──────────────────────────────────────────────────────

function PrayerCard({
  item,
  onAnswered,
}: {
  item: SavedItem;
  onAnswered: (id: string, answeredAt: string, answerNote: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isAnswered = !!item.answeredAt;

  async function markAnswered() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/saved/${item.id}/answer`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answerNote: note.trim() || null }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to save.");
      onAnswered(item.id, data.item.answeredAt, data.item.answerNote);
      setShowForm(false);
      setNote("");
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function unmarkAnswered() {
    setSaving(true);
    try {
      await fetch(`/api/saved/${item.id}/answer`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ unmark: true }),
      });
      onAnswered(item.id, "", null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article
      className={`rounded-[22px] border p-5 transition ${
        isAnswered
          ? "border-emerald-500/25 bg-emerald-900/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/45">
            Prayer
          </span>
          {isAnswered && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">
              ✅ Answered
            </span>
          )}
        </div>
        <span className="text-xs text-white/40">{formatDate(item.createdAt)}</span>
      </div>

      {/* Title */}
      <h3 className="mt-2 text-base font-semibold text-white">
        {item.title || "Prayer"}
      </h3>

      {/* Content */}
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/70">
        {expanded ? item.content : truncate(item.content)}
      </p>
      {item.content.length > 200 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-xs font-semibold text-white/40 hover:text-white/70"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Answered note */}
      {isAnswered && item.answerNote && (
        <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-900/15 px-4 py-3 text-sm text-emerald-200">
          <span className="font-semibold">Answer note: </span>{item.answerNote}
        </div>
      )}
      {isAnswered && item.answeredAt && (
        <div className="mt-2 text-xs text-emerald-400/70">
          Answered on {formatDate(item.answeredAt)}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!isAnswered && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
          >
            Mark Answered
          </button>
        )}
        {isAnswered && (
          <button
            type="button"
            onClick={unmarkAnswered}
            disabled={saving}
            className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-white/40 hover:text-white/70 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Unmark"}
          </button>
        )}
      </div>

      {/* Mark answered inline form */}
      {showForm && !isAnswered && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <label className="block text-xs font-semibold text-white/70">
            Add a note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How did God answer this prayer?"
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/25"
          />
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={markAnswered}
              disabled={saving}
              className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Record Answer"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setNote(""); setError(""); }}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

// ── Main dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [journalFilter, setJournalFilter] = useState<"all" | "unanswered" | "answered">("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError("");

        const meRes = await fetch("/api/me", { cache: "no-store" });
        const meData = meRes.ok ? await meRes.json() : null;

        if (cancelled) return;
        setMe(meData);

        const signedIn = !!(meData?.signedIn ?? meData?.authed);

        if (signedIn) {
          const [savedRes] = await Promise.all([
            fetch("/api/saved", { cache: "no-store" }),
          ]);
          const savedData = savedRes.ok ? await savedRes.json() : { items: [] };
          if (!cancelled) setSavedItems(savedData.items || []);

          // Ping streak fire-and-forget (don't block UI)
          fetch("/api/streak/ping", { method: "POST", cache: "no-store" })
            .then((r) => r.ok ? r.json() : null)
            .then((d) => { if (d && !cancelled) setStreak(d); })
            .catch(() => {});
        } else {
          setSavedItems([]);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load your dashboard right now.");
          setSavedItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setError("");
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to log out.");
      window.location.href = "/login";
    } catch (err: any) {
      setError(err?.message || "Failed to log out.");
      setLoggingOut(false);
    }
  }

  function handlePrayerAnswered(id: string, answeredAt: string, answerNote: string | null) {
    setSavedItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, answeredAt: answeredAt || null, answerNote }
          : item
      )
    );
  }

  const signedIn = !!(me?.signedIn ?? me?.authed);
  const premiumActive = isPremiumActive(me);

  const counts = useMemo(() => ({
    total: savedItems.length,
    verses: savedItems.filter((x) => x.type === "verse").length,
    prayers: savedItems.filter((x) => x.type === "prayer").length,
    answers: savedItems.filter((x) => x.type === "answer").length,
  }), [savedItems]);

  const prayers = useMemo(
    () => savedItems.filter((x) => x.type === "prayer").sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [savedItems]
  );

  const filteredPrayers = useMemo(() => {
    if (journalFilter === "answered") return prayers.filter((p) => !!p.answeredAt);
    if (journalFilter === "unanswered") return prayers.filter((p) => !p.answeredAt);
    return prayers;
  }, [prayers, journalFilter]);

  const answeredCount = useMemo(() => prayers.filter((p) => !!p.answeredAt).length, [prayers]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-white/70 backdrop-blur">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">

      {/* ── Welcome header ── */}
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium text-white/60">Dashboard</div>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              {signedIn ? "Welcome back" : "Your faith journey starts here"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
              {signedIn
                ? premiumActive
                  ? "Your premium faith journal is active. Revisit what matters, stay consistent, and keep growing."
                  : "You're signed in. Upgrade to Premium to save your journey, unlock unlimited use, and build your personal faith journal."
                : "Sign in to save your spiritual journey, revisit meaningful verses, and build your personal faith journal."}
            </p>
            {signedIn && me?.email && (
              <div className="mt-3 text-sm text-white/50">{me.email}</div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/tools/verse" className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
              New Verse
            </Link>
            <Link href="/tools" className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
              Open Tools
            </Link>
            {signedIn ? (
              <button type="button" onClick={handleLogout} disabled={loggingOut}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60">
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            ) : (
              <Link href="/login" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Stats grid ── */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Plan</div>
          <div className="mt-2 text-2xl font-bold text-white">
            {premiumActive ? "Premium" : signedIn ? "Free Account" : "Guest"}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Saved items</div>
          <div className="mt-2 text-2xl font-bold text-white">{signedIn ? counts.total : "—"}</div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Saved verses</div>
          <div className="mt-2 text-2xl font-bold text-white">{signedIn ? counts.verses : "—"}</div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Prayers saved</div>
          <div className="mt-2 text-2xl font-bold text-white">{signedIn ? counts.prayers : "—"}</div>
        </div>
      </section>

      {/* ── Daily Streak ── */}
      <section className="mt-8">
        {!signedIn ? null : premiumActive ? (
          <div className="rounded-[24px] border border-orange-500/25 bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-3xl">
                  🔥
                </div>
                <div>
                  {streak ? (
                    <>
                      <div className="text-2xl font-extrabold text-white">
                        Day {streak.currentStreak} streak
                      </div>
                      <div className="mt-0.5 text-sm text-white/65">
                        {streak.currentStreak === 1
                          ? "Great start — come back tomorrow to build your streak!"
                          : streak.currentStreak < 7
                          ? "Keep it going — consistency is everything."
                          : streak.currentStreak < 30
                          ? "You're building a real habit. Don't break the chain!"
                          : "Incredible dedication. Your faith is consistent."}
                      </div>
                      {streak.longestStreak > streak.currentStreak && (
                        <div className="mt-1 text-xs text-white/40">
                          Personal best: {streak.longestStreak} days
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-extrabold text-white">Streak</div>
                      <div className="mt-0.5 text-sm text-white/65">Loading your streak…</div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 text-center">
                <div className="rounded-2xl border border-orange-500/20 bg-black/20 px-5 py-3">
                  <div className="text-3xl font-extrabold text-orange-300">
                    {streak?.currentStreak ?? "—"}
                  </div>
                  <div className="text-xs text-white/50">days in a row</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="font-semibold text-white">Daily streak tracker</div>
                <div className="mt-0.5 text-sm text-white/60">
                  Track your consecutive days of faith practice and build lasting consistency.
                </div>
              </div>
              <Link href="/pricing" className="ml-auto shrink-0 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-xs font-bold text-white hover:opacity-95">
                🔒 Premium
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ── Billing + Support ── */}
      {signedIn && (
        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-white">Billing & plan</h2>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <p><span className="font-semibold text-white">Current plan:</span> {premiumActive ? "Premium" : "Free"}</p>
              {premiumActive && me?.premiumUntil && (
                <p><span className="font-semibold text-white">Premium until:</span> {formatDate(me.premiumUntil)}</p>
              )}
              {me?.customerId && (
                <p><span className="font-semibold text-white">Customer record:</span> Connected</p>
              )}
              {me?.subscriptionId && (
                <p><span className="font-semibold text-white">Subscription:</span> Active record found</p>
              )}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/pricing" className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
                {premiumActive ? "View plan options" : "Upgrade to Premium"}
              </Link>
              <a href="mailto:support@faithcompanionai.com?subject=Billing%20Help%20-%20Faith%20Companion%20AI"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                Billing support
              </a>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-white">Support</h2>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <p>Need help with your account, access, saved content, or billing?</p>
              <p>The fastest path is to email support with the email tied to your account.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
                Contact support
              </Link>
              <Link href="/faq" className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                Read FAQ
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Upgrade prompts ── */}
      {!signedIn && (
        <section className="mt-8">
          <UpgradeCTA variant="dashboard" title="Create a free account to keep your journey"
            description="Sign in to save meaningful verses later, then upgrade when you're ready for unlimited guidance and your full faith journal."
            primaryHref="/login" primaryLabel="Sign in" secondaryHref="/pricing" secondaryLabel="See Premium" showFeatures={false} />
        </section>
      )}

      {signedIn && !premiumActive && (
        <section className="mt-8">
          <UpgradeCTA variant="dashboard" title="Unlock your full faith journal"
            description="Premium removes interruptions, unlocks unlimited use, streak tracking, and your complete prayer journal in one place."
            primaryHref="/pricing" primaryLabel="Upgrade to Premium" secondaryHref="/tools/verse" secondaryLabel="Keep Exploring" showFeatures />
        </section>
      )}

      {/* ── Prayer Journal ── */}
      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">My Prayer Journal</h2>
            <p className="mt-1 text-sm text-white/60">
              {premiumActive && prayers.length > 0
                ? `${prayers.length} prayer${prayers.length !== 1 ? "s" : ""} saved — ${answeredCount} answered`
                : "Save prayers from the Prayer tool to build your journal."}
            </p>
          </div>

          {premiumActive && prayers.length > 0 && (
            <div className="flex gap-2">
              {(["all", "unanswered", "answered"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setJournalFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    journalFilter === f
                      ? "bg-white text-black"
                      : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}>
                  {f === "all" ? "All" : f === "unanswered" ? "Unanswered" : "Answered"}
                </button>
              ))}
            </div>
          )}
        </div>

        {!signedIn ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-black/10 p-6 text-sm text-white/60">
            Sign in to start building your prayer journal.
          </div>
        ) : !premiumActive ? (
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="text-3xl">🙏</div>
              <div className="flex-1">
                <div className="font-semibold text-white">Prayer Journal is a Premium feature</div>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Save prayers from the Prayer tool, track which ones have been answered, and add notes
                  about how God responded. Your whole prayer history in one place.
                </p>
                <Link href="/pricing"
                  className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-2 text-sm font-semibold text-white hover:opacity-95">
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          </div>
        ) : prayers.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-black/10 p-6 text-sm text-white/60">
            No prayers saved yet. Generate a prayer and save it to start your journal.{" "}
            <Link href="/tools/prayer" className="font-semibold text-orange-400 hover:text-orange-300">
              Write a prayer →
            </Link>
          </div>
        ) : filteredPrayers.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-black/10 p-6 text-sm text-white/60">
            No {journalFilter} prayers yet.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrayers.map((item) => (
              <PrayerCard key={item.id} item={item} onAnswered={handlePrayerAnswered} />
            ))}
          </div>
        )}
      </section>

      {/* ── Saved journey (all types) ── */}
      <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Saved journey</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Revisit your most meaningful verses, prayers, and devotional moments.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/tools/verse"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
              Generate More
            </Link>
            {!premiumActive && (
              <Link href="/pricing"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
                Upgrade
              </Link>
            )}
          </div>
        </div>

        {!signedIn ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-white/10 bg-black/10 p-6 text-sm leading-7 text-white/70">
            Sign in first to start saving your verses and building a personal faith journal.
          </div>
        ) : savedItems.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-white/10 bg-black/10 p-6 text-sm leading-7 text-white/70">
            Nothing saved yet. Generate a verse or prayer and save it to start building your faith journal.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {savedItems.slice(0, 10).map((item) => (
              <article key={item.id} className="rounded-[24px] border border-white/10 bg-black/15 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/50">{item.type}</span>
                    {item.type === "prayer" && item.answeredAt && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">✅ Answered</span>
                    )}
                  </div>
                  <div className="text-xs text-white/50">{formatDate(item.createdAt)}</div>
                </div>
                <h3 className="mt-3 text-base font-semibold text-white">{item.title || "Saved item"}</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">{truncate(item.content)}</p>
                {item.reference && <div className="mt-3 text-xs text-white/50">{item.reference}</div>}
              </article>
            ))}
            {savedItems.length > 10 && (
              <p className="text-center text-sm text-white/50">
                Showing 10 of {savedItems.length} saved items.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
