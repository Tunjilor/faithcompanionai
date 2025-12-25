"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BrandHeader from "@/components/BrandHeader";

type Mode = "verse" | "prayer" | "devotional";
type Tone = "gentle" | "firm" | "short" | "detailed";

type SavedItem = {
  id: string;
  createdAt: number;
  mode: Mode;
  prompt: string;
  answer: string;
};

const STORAGE_KEY = "faithcompanion_favorites_v1";

function formatDate(ts: number) {
  return new Date(ts).toLocaleString();
}

export default function ToolsPage() {
  const [prompt, setPrompt] = useState("Give me an encouraging Bible verse for anxiety.");
  const [mode, setMode] = useState<Mode>("verse");

  const [name, setName] = useState("");
  const [situation, setSituation] = useState("");
  const [tone, setTone] = useState<Tone>("gentle");

  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [activeSavedId, setActiveSavedId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const canSubmit = useMemo(() => !isLoading && prompt.trim().length > 0, [isLoading, prompt]);

  const activeSaved = useMemo(() => {
    if (!activeSavedId) return null;
    return saved.find((s) => s.id === activeSavedId) ?? null;
  }, [activeSavedId, saved]);

  // Load favorites on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedItem[];
        if (Array.isArray(parsed)) setSaved(parsed);
      }
    } catch {
      // ignore
    }
    textareaRef.current?.focus();
  }, []);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // ignore
    }
  }, [saved]);

  async function handleAsk() {
    setError("");
    setAnswer("");
    setActiveSavedId(null);

    const q = prompt.trim();
    if (!q) {
      setError("Please type a question first.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: q,
          mode,
          name: name.trim(),
          situation: situation.trim(),
          tone,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        try {
          const maybeJson = JSON.parse(text);
          throw new Error(maybeJson?.error || maybeJson?.message || `Request failed (${res.status})`);
        } catch {
          throw new Error(text || `Request failed (${res.status})`);
        }
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("API returned an invalid response (not JSON).");
      }

      const out = data?.answer ?? "";
      if (!out) throw new Error("No answer was returned from the API.");

      setAnswer(out);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setPrompt("");
    setAnswer("");
    setError("");
    setActiveSavedId(null);
    textareaRef.current?.focus();
  }

  async function handleCopy(textToCopy: string) {
    if (!textToCopy) return;
    await navigator.clipboard.writeText(textToCopy);
  }

  function handleSaveCurrent() {
    setError("");

    const q = prompt.trim();
    if (!q || !answer) {
      setError("Ask a question first — then you can save the result.");
      return;
    }

    const item: SavedItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      mode,
      prompt: q,
      answer,
    };

    setSaved((prev) => [item, ...prev]);
    setActiveSavedId(item.id);
  }

  function handleOpenSaved(item: SavedItem) {
    setActiveSavedId(item.id);
    setPrompt(item.prompt);
    setMode(item.mode);
    setAnswer(item.answer);
    setError("");
  }

  function handleDeleteSaved(id: string) {
    setSaved((prev) => prev.filter((x) => x.id !== id));
    if (activeSavedId === id) setActiveSavedId(null);
  }

  function handleClearAllSaved() {
    setSaved([]);
    setActiveSavedId(null);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) handleAsk();
    }
  }

  const showingAnswer = activeSaved ? activeSaved.answer : answer;

  return (
    <main className="min-h-screen app-bg text-slate-900 px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left: Tool */}
        <section>
          <BrandHeader
            title="Tools"
            subtitle="Ask for a verse, a prayer, or a devotional — grounded in Scripture references."
          />

          <div className="brand-surface rounded-2xl p-6">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as Mode)}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                >
                  <option value="verse">Verse</option>
                  <option value="prayer">Prayer</option>
                  <option value="devotional">Devotional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as Tone)}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                >
                  <option value="gentle">Gentle</option>
                  <option value="firm">Firm</option>
                  <option value="short">Short</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your name (optional)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Glen"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  What are you dealing with? (optional)
                </label>
                <input
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Anxiety at night, job stress, family concerns…"
                />
              </div>
            </div>

            <label className="block text-sm font-semibold mb-2 text-slate-800">Ask something</label>

            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={onKeyDown}
              rows={5}
              className="w-full rounded-xl border border-black/10 bg-white p-4 outline-none focus:ring-2 focus:ring-black/10"
              placeholder="Ask for a verse, a prayer, or encouragement..."
            />

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={handleAsk}
                disabled={!canSubmit}
                className={`px-5 py-3 rounded-xl font-semibold transition text-white
                  ${canSubmit ? "brand-gradient-bg hover:opacity-95" : "bg-black/20 cursor-not-allowed"}
                `}
              >
                {isLoading ? "Thinking…" : "Ask"}
              </button>

              <button
                onClick={handleSaveCurrent}
                disabled={!answer || isLoading}
                className={`px-5 py-3 rounded-xl font-semibold transition
                  ${answer && !isLoading ? "bg-black/5 hover:bg-black/10" : "bg-black/5 opacity-40 cursor-not-allowed"}
                `}
              >
                Save
              </button>

              <button
                onClick={handleClear}
                className="px-5 py-3 rounded-xl font-semibold bg-black/5 hover:bg-black/10 transition"
              >
                Clear
              </button>

              <button
                onClick={() => handleCopy(showingAnswer)}
                disabled={!showingAnswer}
                className={`px-5 py-3 rounded-xl font-semibold transition
                  ${showingAnswer ? "bg-black/5 hover:bg-black/10" : "bg-black/5 opacity-40 cursor-not-allowed"}
                `}
              >
                Copy answer
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}

            {showingAnswer && (
              <div className="mt-6 rounded-xl border border-black/10 bg-white p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="text-sm text-slate-600">
                    {activeSaved ? "Saved Answer" : "Answer"} • <span className="uppercase">{mode}</span>
                  </div>
                  {activeSaved && <div className="text-xs text-slate-500">{formatDate(activeSaved.createdAt)}</div>}
                </div>

                <pre className="whitespace-pre-wrap font-sans leading-relaxed text-slate-900">{showingAnswer}</pre>
              </div>
            )}

            <div className="mt-6 text-xs text-slate-500">
              Tip: Press <b>Enter</b> to send, <b>Shift + Enter</b> for a new line.
            </div>
          </div>
        </section>

        {/* Right: Saved */}
        <aside className="brand-surface rounded-2xl p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Saved</h2>
            <button
              onClick={handleClearAllSaved}
              disabled={saved.length === 0}
              className={`text-sm px-3 py-2 rounded-xl transition
                ${saved.length ? "bg-black/5 hover:bg-black/10" : "bg-black/5 opacity-40 cursor-not-allowed"}
              `}
            >
              Clear all
            </button>
          </div>

          {saved.length === 0 ? (
            <div className="text-sm text-slate-600">
              No saved items yet. Ask something, then click <b>Save</b>.
            </div>
          ) : (
            <div className="space-y-3">
              {saved.slice(0, 20).map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 cursor-pointer transition
                    ${
                      item.id === activeSavedId
                        ? "border-black/20 bg-black/5"
                        : "border-black/10 bg-white hover:bg-black/5"
                    }
                  `}
                  onClick={() => handleOpenSaved(item)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-600 uppercase">{item.mode}</div>
                    <div className="text-xs text-slate-500">{formatDate(item.createdAt)}</div>
                  </div>

                  <div className="mt-2 text-sm font-semibold line-clamp-2 text-slate-900">{item.prompt}</div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.answer);
                      }}
                      className="text-xs px-3 py-2 rounded-xl bg-black/5 hover:bg-black/10 transition"
                    >
                      Copy
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSaved(item.id);
                      }}
                      className="text-xs px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 transition text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-xs text-slate-500">
            Saved items are stored on this device (localStorage). We’ll sync to accounts later.
          </div>
        </aside>
      </div>
    </main>
  );
}
