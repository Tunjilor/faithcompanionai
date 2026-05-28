"use client";

import { useEffect, useMemo, useState } from "react";
import { loadFavorites, removeFavorite, saveFavorite } from "@/lib/favorites";

type VersePayload = {
  dayKey: string;
  translation: string;
  reference: string;
  text: string;
  sourceUrl?: string;
};

export default function VerseOfDay() {
  const [verse, setVerse] = useState<VersePayload | null>(null);
  const [aiOutput, setAiOutput] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [err, setErr] = useState<string>("");

  const favorites = useMemo(() => loadFavorites(), []);
  const isFav = useMemo(() => {
    if (!verse) return false;
    return favorites.some((f) => f.dayKey === verse.dayKey && f.translation === verse.translation);
  }, [favorites, verse]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingVerse(true);
        const res = await fetch("/api/verse/today", { cache: "no-store" });
        const data = await res.json();
        setVerse(data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load verse");
      } finally {
        setLoadingVerse(false);
      }
    })();
  }, []);

  async function runAI(kind: "explain" | "devotional" | "qa") {
    if (!verse) return;
    setErr("");
    setAiOutput("");
    setLoadingAI(true);

    try {
      const res = await fetch("/api/ai/verse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          reference: verse.reference,
          verseText: verse.text,
          question: kind === "qa" ? question : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data?.error || "AI request failed");
        return;
      }

      setAiOutput(data.output);
    } catch (e: any) {
      setErr(e?.message || "AI request failed");
    } finally {
      setLoadingAI(false);
    }
  }

  function toggleFavorite() {
    if (!verse) return;
    if (isFav) {
      removeFavorite(verse.dayKey, verse.translation);
      window.location.reload(); // simplest refresh
    } else {
      saveFavorite({
        dayKey: verse.dayKey,
        translation: verse.translation,
        reference: verse.reference,
        text: verse.text,
      });
      window.location.reload();
    }
  }

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-3">Verse of the Day</h1>

      {loadingVerse && <p>Loading…</p>}

      {!loadingVerse && verse && (
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm opacity-70">{verse.translation}</p>
              <p className="text-lg font-medium">{verse.reference}</p>
            </div>
            <button
              onClick={toggleFavorite}
              className="rounded-md border px-3 py-1 text-sm"
            >
              {isFav ? "Unfavorite" : "Save Favorite"}
            </button>
          </div>

          <p className="mt-3 leading-relaxed whitespace-pre-line">{verse.text}</p>

          {verse.sourceUrl && (
            <a className="text-sm underline mt-3 inline-block" href={verse.sourceUrl} target="_blank">
              Source
            </a>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => runAI("explain")}
              className="rounded-md border px-3 py-2 text-sm"
              disabled={loadingAI}
            >
              Explain
            </button>
            <button
              onClick={() => runAI("devotional")}
              className="rounded-md border px-3 py-2 text-sm"
              disabled={loadingAI}
            >
              Devotional
            </button>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Ask a question</label>
            <div className="flex gap-2 mt-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 rounded-md border px-3 py-2 text-sm"
                placeholder="What does this mean for my life today?"
              />
              <button
                onClick={() => runAI("qa")}
                className="rounded-md border px-3 py-2 text-sm"
                disabled={loadingAI || !question.trim()}
              >
                Ask
              </button>
            </div>
          </div>

          {loadingAI && <p className="mt-4">Thinking…</p>}

          {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

          {aiOutput && (
            <div className="mt-4 rounded-md bg-black/5 p-3 whitespace-pre-line">
              {aiOutput}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
export { VerseOfDay };
