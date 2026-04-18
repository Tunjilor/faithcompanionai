// src/app/tools/verse/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Length = "short" | "medium" | "long";

type MeResponse = {
  signedIn?: boolean;
  isPremium?: boolean;
  premiumUntil?: string | null;
};

type VerseResponse = {
  verses?: string[];
  encouragement?: string;
  nextStep?: string;
  error?: string;
};

type ResultData = {
  verses: string[];
  encouragement: string;
  nextStep: string;
};

function isPremiumActive(me: MeResponse | null) {
  if (!me?.isPremium) return false;
  if (!me?.premiumUntil) return false;
  return new Date(me.premiumUntil).getTime() > Date.now();
}

function resultToText(data: ResultData): string {
  return [
    "Bible References:",
    ...data.verses.map((v) => `- ${v}`),
    "",
    `Encouragement: ${data.encouragement}`,
    "",
    `Next Step: ${data.nextStep}`,
  ].join("\n");
}

export default function VersePage() {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState<Length>("short");
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    setIsLoading(true);

    try {
      const res = await fetch("/api/verse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          length,
        }),
      });

      const text = await res.text();

      let data: VerseResponse = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || "Unexpected response." };
      }

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      if (!data.verses || !data.encouragement || !data.nextStep) {
        throw new Error("Incomplete verse response.");
      }

      setResult({
        verses: data.verses,
        encouragement: data.encouragement,
        nextStep: data.nextStep,
      });
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!result) {
      setError("Generate a verse thought first.");
      return;
    }

    if (!isPremiumActive(me)) {
      setError("Upgrade to Premium to save your verses and build your personal faith journal.");
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
          type: "verse",
          title: topic.trim() || `Verse thought (${length})`,
          content: resultToText(result),
          reference: null,
          meta: {
            topic: topic.trim() || null,
            length,
          },
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

      setSuccess("Saved to your account.");
    } catch (err: any) {
      setError(err?.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setTopic("");
    setLength("short");
    setResult("");
    setError("");
    setSuccess("");
  }

  const premiumActive = isPremiumActive(me);

  const lengthHelp = useMemo(() => {
    switch (length) {
      case "short":
        return "Quick encouragement";
      case "medium":
        return "Balanced reflection";
      case "long":
        return "More detailed encouragement";
      default:
        return "";
    }
  }, [length]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Verse</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Generate a short verse thought with Scripture references and a simple next step.
        </p>
      </header>

      <div className="rounded-[28px] border border-white/10 bg-white p-6 shadow-2xl md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
              Topic (optional)
            </label>
            <input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., peace, anxiety, forgiveness, guidance"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label htmlFor="length" className="block text-sm font-medium text-slate-700">
              Length
            </label>
            <select
              id="length"
              value={length}
              onChange={(e) => setLength(e.target.value as Length)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white outline-none focus:border-slate-500 focus:ring-2 focus:ring-black/10"
            >
              <option value="short" className="bg-white text-slate-900">
                Short
              </option>
              <option value="medium" className="bg-white text-slate-900">
                Medium
              </option>
              <option value="long" className="bg-white text-slate-900">
                Long
              </option>
            </select>
            <p className="mt-2 text-xs text-slate-500">{lengthHelp}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Generating..." : "Generate verse thought"}
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
              title="Upgrade to Premium to save verses"
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

        {error && (
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
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-800">Result</div>
              <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                Length: {length.charAt(0).toUpperCase() + length.slice(1)}
              </div>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <div>
                <p className="font-semibold text-slate-900">Bible References</p>
                <ul className="mt-1 space-y-1 pl-1">
                  {result.verses.map((v) => (
                    <li key={v} className="flex gap-2">
                      <span className="text-slate-400">—</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-slate-900">Encouragement</p>
                <p className="mt-1">{result.encouragement}</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900">Next Step</p>
                <p className="mt-1">{result.nextStep}</p>
              </div>
            </div>

            {!premiumActive && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">
                  Upgrade to Premium to save your verses
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Premium members can save favorite verses, revisit meaningful moments, and keep their faith journey organized in one place.
                </p>
                <div className="mt-3">
                  <Link
                    href="/pricing"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    See Premium
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-600">
              Your verse thought will appear here with Scripture references and a simple next step.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}