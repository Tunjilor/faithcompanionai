// src/app/tools/scripture-memory/page.tsx
"use client";
import { useUser } from "@/context/UserContext";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "fcai_scripture_memory_v1";
const FREE_LIMIT = 3;

type MemoryVerse = {
  id: string;
  reference: string;
  text: string;
  addedAt: number;
  bestScore?: number;
};

type WordResult = {
  target: string;
  attempt: string;
  correct: boolean;
};

type Mode = "list" | "practice" | "results";

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function scoreWords(target: string, attempt: string): WordResult[] {
  const tWords = target.trim().split(/\s+/);
  const aWords = attempt.trim().split(/\s+/);
  return tWords.map((word, i) => {
    const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
    return {
      target: word,
      attempt: aWords[i] ?? "",
      correct: clean(word) === clean(aWords[i] ?? ""),
    };
  });
}

function isPremiumActive(me: { isPremium?: boolean; premiumUntil?: string | null } | null) {
  if (!me?.isPremium) return false;
  if (!me?.premiumUntil) return true;
  return new Date(me.premiumUntil).getTime() > Date.now();
}

export default function ScriptureMemoryPage() {
  const [verses, setVerses] = useState<MemoryVerse[]>([]);
  const [me, setMe] = useState<{ isPremium?: boolean; premiumUntil?: string | null } | null>(null);

  // Add form
  const [ref, setRef] = useState("");
  const [text, setText] = useState("");
  const [addError, setAddError] = useState("");

  // Practice
  const [mode, setMode] = useState<Mode>("list");
  const [activeVerse, setActiveVerse] = useState<MemoryVerse | null>(null);
  const [userInput, setUserInput] = useState("");
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [results, setResults] = useState<WordResult[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setVerses(JSON.parse(raw) as MemoryVerse[]);
    } catch { /* ignore */ }

    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setMe(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verses));
    } catch { /* ignore */ }
  }, [verses]);

  const premium = isPremiumActive(me);
  const atLimit = !premium && verses.length >= FREE_LIMIT;

  function addVerse() {
    setAddError("");
    if (!ref.trim() || !text.trim()) {
      setAddError("Both reference and verse text are required.");
      return;
    }
    if (atLimit) {
      setAddError(`Free accounts can save up to ${FREE_LIMIT} verses. Upgrade to Premium for unlimited.`);
      return;
    }
    const verse: MemoryVerse = {
      id: crypto.randomUUID(),
      reference: ref.trim(),
      text: text.trim(),
      addedAt: Date.now(),
    };
    setVerses((prev) => [verse, ...prev]);
    setRef("");
    setText("");
  }

  function deleteVerse(id: string) {
    setVerses((prev) => prev.filter((v) => v.id !== id));
  }

  function startPractice(verse: MemoryVerse) {
    setActiveVerse(verse);
    setUserInput("");
    setHintsRevealed(0);
    setResults([]);
    setMode("practice");
  }

  function revealHint() {
    if (!activeVerse) return;
    const words = activeVerse.text.trim().split(/\s+/);
    setHintsRevealed((h) => Math.min(h + 1, words.length));
  }

  function submitAttempt() {
    if (!activeVerse) return;
    const wordResults = scoreWords(activeVerse.text, userInput);
    const pct = Math.round(wordResults.filter((w) => w.correct).length / wordResults.length * 100);
    setResults(wordResults);
    setVerses((prev) =>
      prev.map((v) =>
        v.id === activeVerse.id
          ? { ...v, bestScore: Math.max(v.bestScore ?? 0, pct) }
          : v
      )
    );
    setMode("results");
  }

  const score = useMemo(() => {
    if (!results.length) return 0;
    return Math.round(results.filter((w) => w.correct).length / results.length * 100);
  }, [results]);

  const hintText = useMemo(() => {
    if (!activeVerse || hintsRevealed === 0) return null;
    const words = activeVerse.text.trim().split(/\s+/);
    return words.slice(0, hintsRevealed).join(" ") + (hintsRevealed < words.length ? " …" : "");
  }, [activeVerse, hintsRevealed]);

  // â”€â”€ Practice screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (mode === "practice" && activeVerse) {
    const words = activeVerse.text.trim().split(/\s+/);
    const allHinted = hintsRevealed >= words.length;

    return (
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
        <button
          type="button"
          onClick={() => setMode("list")}
          className="mb-6 text-sm text-white/50 hover:text-white"
        >
          ← Back to verses
        </button>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-orange-300">
            Practice
          </div>
          <h2 className="mt-2 text-2xl font-bold text-white">{activeVerse.reference}</h2>

          {hintText && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
              <span className="text-xs font-semibold text-white/40 mr-2">Hint:</span>
              {hintText}
            </div>
          )}

          <div className="mt-5">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Type the verse from memory
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={5}
              placeholder="Start typing the verse…"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/25"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={submitAttempt}
              disabled={!userInput.trim()}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-40"
            >
              Check my answer
            </button>

            <button
              type="button"
              onClick={revealHint}
              disabled={allHinted}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-40"
            >
              {allHinted ? "All words shown" : `Hint (${hintsRevealed}/${words.length} words)`}
            </button>

            <button
              type="button"
              onClick={() => setMode("list")}
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/60 hover:text-white"
            >
              Give up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ Results screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (mode === "results" && activeVerse) {
    const emoji = score === 100 ? "ðŸŽ‰" : score >= 80 ? "✅" : score >= 50 ? "ðŸ“–" : "ðŸ“";

    return (
      <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="text-center">
            <div className="text-5xl">{emoji}</div>
            <div className="mt-3 text-4xl font-extrabold text-white">{score}%</div>
            <div className="mt-1 text-sm text-white/60">
              {score === 100
                ? "Perfect! You nailed it."
                : score >= 80
                ? "Great work — almost perfect!"
                : score >= 50
                ? "Good effort. Keep practicing!"
                : "Keep going — repetition is the key!"}
            </div>
            <div className="mt-1 text-xs text-white/40">
              {results.filter((w) => w.correct).length} of {results.length} words correct
              {hintsRevealed > 0 && ` · ${hintsRevealed} hint${hintsRevealed !== 1 ? "s" : ""} used`}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="text-xs font-semibold text-white/40 mb-3">Word-by-word review</div>
            <div className="flex flex-wrap gap-1.5 text-sm">
              {results.map((w, i) => (
                <span
                  key={i}
                  className={classNames(
                    "rounded-lg px-2 py-0.5 font-medium",
                    w.correct
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  )}
                  title={w.correct ? "Correct" : `You wrote: "${w.attempt}"`}
                >
                  {w.target}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => startPractice(activeVerse)}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => setMode("list")}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back to verses
            </button>
          </div>
        </div>
      </div>
    );
  }

  // â”€â”€ List / add screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Scripture Memory</h1>
        <p className="mt-2 text-sm text-white/60">
          Add verses you want to memorize, then practice them as flashcards. Word-by-word hints available.
        </p>
      </header>

      {/* Add verse form */}
      <section className="rounded-[24px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-bold text-white">Add a verse</h2>

        {!premium && (
          <div className="mt-2 text-xs text-white/50">
            Free:{" "}
            <span className={verses.length >= FREE_LIMIT ? "text-orange-400 font-semibold" : "text-white/50"}>
              {verses.length}/{FREE_LIMIT} verses saved
            </span>
            {verses.length >= FREE_LIMIT && (
              <> — <Link href="/pricing" className="text-orange-300 underline">Upgrade for unlimited</Link></>
            )}
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="Reference (e.g. Philippians 4:6–7)"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/25"
          />
          <div className="sm:col-start-1 sm:col-end-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the verse text here…"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/25"
            />
          </div>
        </div>

        {addError && (
          <p className="mt-2 text-xs text-red-400">{addError}</p>
        )}

        <button
          type="button"
          onClick={addVerse}
          disabled={atLimit}
          className="mt-3 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-40"
        >
          Save verse
        </button>
      </section>

      {/* Verse list */}
      <section className="mt-6">
        {verses.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-black/10 p-8 text-center text-sm text-white/50">
            No verses saved yet. Add one above to start practicing.
          </div>
        ) : (
          <div className="space-y-4">
            {verses.map((verse) => (
              <article
                key={verse.id}
                className="rounded-[22px] border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white">{verse.reference}</div>
                    <p className="mt-1 text-sm leading-6 text-white/65 line-clamp-2">
                      {verse.text}
                    </p>
                    {typeof verse.bestScore === "number" && (
                      <div className="mt-2 text-xs text-white/40">
                        Best score:{" "}
                        <span className={classNames(
                          "font-semibold",
                          verse.bestScore === 100 ? "text-emerald-400" : verse.bestScore >= 80 ? "text-amber-300" : "text-white/60"
                        )}>
                          {verse.bestScore}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startPractice(verse)}
                      className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:opacity-90"
                    >
                      Practice
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteVerse(verse.id)}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/50 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {!premium && verses.length > 0 && (
        <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white">Unlimited verse cards with Premium</div>
          <p className="mt-1 text-sm text-white/60">
            Free accounts save up to 3 verses. Upgrade to add as many as you want.
          </p>
          <Link
            href="/pricing"
            className="mt-3 inline-flex rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}
    </div>
  );
}



