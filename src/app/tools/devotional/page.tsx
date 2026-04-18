// src/app/tools/devotional/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import UpgradeCTA from "@/components/UpgradeCTA";

function inlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    return m ? <strong key={i} className="font-semibold text-slate-900">{m[1]}</strong> : part;
  });
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const output: React.ReactNode[] = [];
  let key = 0;

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line) {
      output.push(<div key={key++} className="h-2" />);
      continue;
    }

    // Bullet point
    if (/^[-*]\s/.test(line)) {
      output.push(
        <div key={key++} className="flex gap-2 text-sm leading-6 text-slate-700">
          <span className="mt-0.5 text-slate-400">•</span>
          <span>{inlineBold(line.replace(/^[-*]\s/, ""))}</span>
        </div>
      );
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s(.+)/);
    if (numMatch) {
      output.push(
        <div key={key++} className="flex gap-2 text-sm leading-6 text-slate-700">
          <span className="w-4 shrink-0 font-semibold text-slate-500">{numMatch[1]}.</span>
          <span>{inlineBold(numMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Whole-line bold (section heading like **Reflection:** or **Title**)
    const headingMatch = line.match(/^\*\*(.+?)\*\*:?\s*$/);
    if (headingMatch) {
      output.push(
        <p key={key++} className="mt-1 text-sm font-semibold text-slate-900">
          {headingMatch[1]}
        </p>
      );
      continue;
    }

    // Regular line (may contain inline bold)
    output.push(
      <p key={key++} className="text-sm leading-6 text-slate-700">
        {inlineBold(line)}
      </p>
    );
  }

  return output;
}

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
  if (!me?.premiumUntil) return false;
  return new Date(me.premiumUntil).getTime() > Date.now();
}

export default function DevotionalPage() {
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [situation, setSituation] = useState("");
  const [tone, setTone] = useState<Tone>("gentle");

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

  async function handleGenerate() {
    setError("");
    setSuccess("");
    setHardStopped(false);

    const prompt =
      topic.trim().length > 0
        ? `Write a Christian devotional about ${topic.trim()}. ${
            situation.trim() ? `The user is dealing with: ${situation.trim()}.` : ""
          } Include a title, 1-3 Bible references, a reflection, a short prayer, and 2 action steps.`
        : `Write a Christian devotional for today. ${
            situation.trim() ? `The user is dealing with: ${situation.trim()}.` : ""
          } Include a title, 1-3 Bible references, a reflection, a short prayer, and 2 action steps.`;

    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          mode: "devotional",
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
              "You’ve reached your free limit. Upgrade to Premium for unlimited devotionals, prayers, and verses."
          );
          return;
        }

        throw new Error(data.error || `Request failed (${res.status})`);
      }

      if (!data.answer) {
        throw new Error("No devotional returned.");
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
      setError("Generate a devotional first.");
      return;
    }

    if (!isPremiumActive(me)) {
      setError("Upgrade to Premium to save your devotionals and build your personal faith journal.");
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
          type: "answer",
          title: topic.trim() || "Devotional",
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

      setSuccess("Devotional saved to your account.");
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
        <h1 className="text-3xl font-bold text-white md:text-4xl">Devotional</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Generate a devotional with Scripture references, reflection, prayer, and practical next steps.
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
              placeholder="e.g., peace, endurance, hope, forgiveness"
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
              placeholder="e.g., discouragement, uncertainty, fear, waiting"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || hardStopped}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Generating..." : "Generate devotional"}
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
            <Link
              href="/pricing"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
              title="Upgrade to Premium to save devotionals"
            >
              🔒 Save
            </Link>
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
              title="You’re on your last few free devotionals."
              description="Upgrade now to keep going without interruptions and save your devotionals to your faith journal."
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
              title="Your free devotional limit has been reached"
              description={
                error ||
                "You’ve reached your free limit. Upgrade now to continue instantly with unlimited devotionals, prayers, and verses."
              }
              primaryHref="/pricing"
              primaryLabel="Upgrade Now"
              secondaryHref="/tools/devotional"
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
            <div className="text-sm font-semibold text-slate-800">Devotional</div>

            <div className="mt-3 space-y-1">
              {renderMarkdown(result)}
            </div>

            {!premiumActive && (
              <div className="mt-5">
                <UpgradeCTA
                  variant="inline"
                  title="Save this devotional and build your personal faith journal"
                  description="Premium members can save meaningful devotionals, revisit them later, and keep their spiritual growth organized in one place."
                  primaryHref="/pricing"
                  primaryLabel="See Premium"
                  showFeatures={false}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-600">
              Your devotional will appear here with reflection, prayer, Scripture references, and action steps.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}