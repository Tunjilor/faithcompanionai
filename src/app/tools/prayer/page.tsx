// src/app/tools/prayer/page.tsx

"use client";
import { useUser } from "@/context/UserContext";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import UpgradeCTA from "@/components/UpgradeCTA";
import DenominationSelect, { getDenominationNote, readDenomination } from "@/components/DenominationSelect";

type Tone = "gentle" | "firm" | "short" | "detailed";

type MeResponse = {
  signedIn?: boolean;
  isPremium?: boolean;
  premiumUntil?: string | null;
};

type QuotaInfo = {
  kind?: "guest" | "free_user" | "premium_user";
  softUpsell?: boolean;
  quota?: {
    todayUsed: number;
    todayLimit: number;
    totalUsed?: number;
    totalLimit?: number;
    daysUsed?: number;
    daysLimit?: number;
  };
};

type AskResponse = {
  answer?: string;
  quota?: QuotaInfo;
  error?: string;
  code?: string | null;
};

function isPremiumActive(me: MeResponse | null) {
  if (!me?.isPremium) return false;
  if (!me?.premiumUntil) return true;
  return new Date(me.premiumUntil).getTime() > Date.now();
}

export default function PrayerPage() {
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [situation, setSituation] = useState("");
  const [tone, setTone] = useState<Tone>("gentle");
  const [denomination, setDenomination] = useState("non-denominational");

  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hardStopped, setHardStopped] = useState(false);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setMe(data);
      } catch {
        if (!cancelled) setMe(null);
      }
    }

    loadMe();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setDenomination(readDenomination());
    const onChanged = () => setDenomination(readDenomination());
    window.addEventListener("denomination-changed", onChanged);
    return () => window.removeEventListener("denomination-changed", onChanged);
  }, []);

  async function handleGenerate() {
    setError("");
    setSuccess("");
    setHardStopped(false);

    const denomNote = getDenominationNote(denomination);
    const prompt =
      topic.trim().length > 0
        ? `Write a sincere Christian prayer about ${topic.trim()}. ${situation.trim() ? `The situation is: ${situation.trim()}.` : ""} Include 1-3 Bible references and make it suitable for daily encouragement.${denomNote}`
        : `Write a sincere Christian prayer for today. ${situation.trim() ? `The situation is: ${situation.trim()}.` : ""} Include 1-3 Bible references and make it suitable for daily encouragement.${denomNote}`;

    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          mode: "prayer",
          tone,
          name: name.trim(),
          situation: situation.trim(),
        }),
      });

      const text = await res.text();

      let data: AskResponse = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || "Unexpected response." };
      }

      if (!res.ok) {
        if (res.status === 429) {
          setHardStopped(true);
          setQuota(data.quota ?? null);
          setError(
            data.error ||
              "You’ve reached your free limit. Upgrade to Premium for unlimited prayers, verses, and devotionals."
          );
          return;
        }

        throw new Error(data.error || `Request failed (${res.status})`);
      }

      if (!data.answer) {
        throw new Error("No prayer returned.");
      }

      setResult(data.answer);
      setQuota(data.quota ?? null);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!result.trim()) {
      setError("Generate a prayer first.");
      return;
    }

    if (!isPremiumActive(me)) {
      setError("Upgrade to Premium to save your prayers and build your personal faith journal.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "prayer",
          title: topic.trim() || "Prayer",
          content: result,
          reference: null,
        }),
      });

      const text = await res.text();

      let data: { error?: string } = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || "Failed to save." };
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to save.");
      }

      setSuccess("Prayer saved to your account.");
    } catch (err: any) {
      setError(err?.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setTopic("");
    setName("");
    setSituation("");
    setTone("gentle");
    setResult("");
    setError("");
    setSuccess("");
    setHardStopped(false);
    setQuota(null);
  }

  const premiumActive = isPremiumActive(me);

  const remainingToday =
    typeof quota?.quota?.todayUsed === "number" && typeof quota?.quota?.todayLimit === "number"
      ? quota.quota.todayLimit - quota.quota.todayUsed
      : null;

  const remainingTotal =
    typeof quota?.quota?.totalUsed === "number" && typeof quota?.quota?.totalLimit === "number"
      ? quota.quota.totalLimit - quota.quota.totalUsed
      : null;

  const remainingDays =
    typeof quota?.quota?.daysUsed === "number" && typeof quota?.quota?.daysLimit === "number"
      ? quota.quota.daysLimit - quota.quota.daysUsed
      : null;

  const showSoftUpsell = !!quota?.softUpsell && !hardStopped;

  const usageTone = useMemo(() => {
    if (remainingToday === null) return "neutral";
    if (remainingToday <= 1) return "danger";
    if (remainingToday <= 3) return "warn";
    return "neutral";
  }, [remainingToday]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Prayer</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Generate a personal prayer for your current need, with Scripture references and a calm, encouraging tone.
        </p>
      </header>

      <div className="rounded-[28px] border border-white/10 bg-white p-6 shadow-2xl md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
              Topic
            </label>
            <input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., peace, healing, strength, guidance"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-slate-700">
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="gentle">Gentle</option>
              <option value="firm">Firm</option>
              <option value="short">Short</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Your name (optional)
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sarah"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label htmlFor="situation" className="block text-sm font-medium text-slate-700">
              What are you facing? (optional)
            </label>
            <input
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., anxiety, family stress, grief, uncertainty"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Tradition</label>
            <DenominationSelect className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || hardStopped}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Generating..." : "Generate prayer"}
          </button>

          {premiumActive ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={!result || isSaving}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              <Link
                href="/pricing"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Unlock Your Faith Journey
              </Link>
              <p className="text-center text-xs text-slate-400">Save prayers with Premium</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>

        {quota?.quota && !hardStopped && (
          <div
            className={`mt-5 rounded-2xl p-4 text-sm ${
              usageTone === "danger"
                ? "border border-red-200 bg-red-50 text-red-800"
                : usageTone === "warn"
                ? "border border-amber-200 bg-amber-50 text-amber-900"
                : "border border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <div className="mb-2 font-semibold">Your free usage</div>

            <div>Used today: {quota.quota.todayUsed} / {quota.quota.todayLimit}</div>

            {remainingToday !== null && (
              <div className="mt-1 font-medium">
                Remaining today: {remainingToday}
              </div>
            )}

            {typeof quota.quota.totalUsed === "number" && typeof quota.quota.totalLimit === "number" && (
              <div className="mt-2">
                Total guest uses: {quota.quota.totalUsed} / {quota.quota.totalLimit}
                {remainingTotal !== null && (
                  <span className="ml-2 font-medium">({remainingTotal} left)</span>
                )}
              </div>
            )}

            {typeof quota.quota.daysUsed === "number" && typeof quota.quota.daysLimit === "number" && (
              <div className="mt-1">
                Trial days used: {quota.quota.daysUsed} / {quota.quota.daysLimit}
                {remainingDays !== null && (
                  <span className="ml-2 font-medium">({remainingDays} left)</span>
                )}
              </div>
            )}
          </div>
        )}

        {showSoftUpsell && (
          <div className="mt-5">
            <UpgradeCTA
              variant="soft"
              title="You’re on your last few free prayer requests."
              description="Upgrade now to keep going without interruptions and save your prayers to your faith journal."
              primaryHref="/pricing"
              primaryLabel="Upgrade to Premium"
              showFeatures={false}
            />
          </div>
        )}

        {hardStopped && (
          <div className="mt-5">
            <UpgradeCTA
              variant="hard_stop"
              title="Your free prayer limit has been reached"
              description={
                error ||
                "You’ve reached your free limit. Upgrade now to continue instantly with unlimited prayers, verses, and devotionals."
              }
              primaryHref="/pricing"
              primaryLabel="Upgrade Now"
              secondaryHref="/tools/prayer"
              secondaryLabel="Reset"
            />
          </div>
        )}

        {error && !hardStopped && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {result ? (
          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-800">Prayer</div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {result}
            </p>

            {!premiumActive && (
              <div className="mt-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-orange-900/10 p-5">
                <h3 className="font-extrabold text-white">Go deeper in your faith journey</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Unlock personalized devotionals, saved progress, and more room to reflect.
                </p>
                <Link
                  href="/pricing"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition"
                >
                  Unlock Your Faith Journey
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-600">
              Your prayer will appear here with Scripture references and a calm, encouraging structure.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}


