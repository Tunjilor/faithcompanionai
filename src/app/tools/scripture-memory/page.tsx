"use client";

import { useState } from "react";

export default function ScriptureMemoryPage() {
  const [verse, setVerse] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Scripture Memory</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Save verses you want to memorize and track your progress. (Persistence will be wired next.)
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Reference</label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., Philippians 4:6–7"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Short Title (optional)</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Peace in anxiety"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">Verse</label>
          <textarea
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            placeholder="Paste or type the verse here…"
            rows={8}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            className="rounded-full brand-gradient px-5 py-3 text-sm font-semibold text-white hover:opacity-95 transition"
            onClick={() => alert("Saving will be enabled next.")}
          >
            Save verse
          </button>

          <button
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            onClick={() => {
              setReference("");
              setNotes("");
              setVerse("");
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </main>
  );
}
