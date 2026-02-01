// src/components/VerseOfDay.tsx
"use client";

import { useEffect, useState } from "react";

type VerseResponse = {
  dayKey: string;
  translation: "WEB";
  reference: string;
  text: string;
  sourceUrl?: string;
  cached: boolean;
};

export default function VerseOfDay() {
  const [data, setData] = useState<VerseResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const res = await fetch("/api/verse-of-the-day?translation=WEB", {
          cache: "no-store"
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load verse");
        setData(json);
      } catch (e: any) {
        setErr(e?.message || "Failed to load verse");
      }
    })();
  }, []);

  if (err) {
    return (
      <div className="rounded-xl border p-4">
        <div className="text-sm text-red-600">Error: {err}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border p-4">
        <div className="text-sm opacity-70">Loading today’s verse…</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-5 shadow-sm">
      <div className="text-xs opacity-70">
        Scripture of the Day • {data.translation} • {data.dayKey}
      </div>

      <div className="mt-2 text-lg font-semibold">{data.reference}</div>
      <div className="mt-2 whitespace-pre-line text-base leading-relaxed">
        {data.text}
      </div>

      {data.sourceUrl ? (
        <div className="mt-3 text-xs opacity-70">
          Source:{" "}
          <a className="underline" href={data.sourceUrl} target="_blank" rel="noreferrer">
            View
          </a>
        </div>
      ) : null}
    </div>
  );
}
