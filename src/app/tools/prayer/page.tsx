"use client";

import { useState } from "react";

export default function DevotionalPage() {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("short");

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Devotional</h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Generate a short devotional thought with Scripture and a simple next step. (Wiring to your AI/API comes next.)
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Topic (optional)</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., peace, anxiety, forgiveness, guidance"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value as any)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full brand-gradient px-5 py-3 text-sm font-semibold text-white hover:opacity-95 transition"
            onClick={() => alert("Devotional generation will be connected next.")}
          >
            Generate devotional
          </button>

          <button
            type="button"
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            onClick={() => {
              setTopic("");
              setLength("short");
            }}
          >
            Reset
          </button>
        </div>

        <div className="mt-8 rounded-xl bg-slate-50 p-5">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">Coming soon:</span> devotional results will appear here
            with Scripture references, a reflection, and a short prayer.
          </p>
        </div>
      </div>
    </main>
  );
}
