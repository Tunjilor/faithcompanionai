"use client";

import { useState } from "react";

export default function PrayerJournalPage() {
  const [entry, setEntry] = useState("");

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Prayer Journal</h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Write, save, and revisit personal prayers. (Persistence will be wired next.)
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <label className="block text-sm font-medium text-slate-700">
          Journal Entry
        </label>

        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your prayer here…"
          rows={8}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />

        <div className="mt-4 flex gap-3">
          <button
            className="rounded-full brand-gradient px-5 py-3 text-sm font-semibold text-white hover:opacity-95 transition"
            onClick={() => alert("Saving will be enabled next.")}
          >
            Save prayer
          </button>

          <button
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            onClick={() => setEntry("")}
          >
            Clear
          </button>
        </div>
      </div>
    </main>
  );
}
