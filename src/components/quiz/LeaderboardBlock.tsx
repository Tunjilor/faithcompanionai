// src/components/quiz/LeaderboardBlock.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LeaderboardItem = {
  rank: number;
  displayName: string;
  score: number;
  total: number;
  percent: number;
  createdAt: string;
  shareId: string | null;
  href: string | null;
};

type LeaderboardResponse = {
  ok?: boolean;
  category?: string;
  categoryName?: string;
  items?: LeaderboardItem[];
  error?: string;
};

function formatDate(input: string) {
  return new Date(input).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function LeaderboardBlock({
  category,
  currentShareId,
  title,
}: {
  category: string;
  currentShareId?: string | null;
  title?: string;
}) {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `/api/quiz/leaderboard?category=${encodeURIComponent(category)}&limit=8`,
          { cache: "no-store" }
        );

        const data = (await res.json()) as LeaderboardResponse;

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load leaderboard.");
        }

        if (!cancelled) {
          setItems(Array.isArray(data.items) ? data.items : []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Could not load leaderboard.");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [category]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">
            {title || "Can anyone beat this score?"}
          </h2>
          <p className="mt-1 text-sm text-white/65">
            Top recent scores in this category.
          </p>
        </div>

        <Link
          href="/biblequiz"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Take the quiz
        </Link>
      </div>

      {loading ? (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
          Loading leaderboard...
        </div>
      ) : error ? (
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
          No leaderboard entries yet. Be the first to set the pace.
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[48px_1fr_72px] sm:grid-cols-[56px_1fr_86px_78px] bg-black/30 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/50">
            <div>Rank</div>
            <div>Player</div>
            <div>Score</div>
            <div className="hidden sm:block">Date</div>
          </div>

          <div className="divide-y divide-white/10">
            {items.map((item) => {
              const isCurrent = currentShareId && item.shareId === currentShareId;

              const rowContent = (
                <div
                  className={`grid grid-cols-[48px_1fr_72px] sm:grid-cols-[56px_1fr_86px_78px] items-center px-4 py-3 text-sm transition ${
                    isCurrent
                      ? "bg-amber-400/10 text-white"
                      : "bg-white/5 text-white/85 hover:bg-white/10"
                  }`}
                >
                  <div className="font-bold">
                    {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : `#${item.rank}`}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate font-semibold">
                      {item.displayName}
                      {isCurrent ? (
                        <span className="ml-2 rounded-full bg-amber-300/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200">
                          You
                        </span>
                      ) : null}
                    </div>
                    <div className="text-xs text-white/50">{item.percent}%</div>
                  </div>

                  <div className="font-bold">
                    {item.score}/{item.total}
                  </div>

                  <div className="hidden text-white/55 sm:block">{formatDate(item.createdAt)}</div>
                </div>
              );

              return item.href ? (
                <Link key={`${item.rank}-${item.shareId}`} href={item.href}>
                  {rowContent}
                </Link>
              ) : (
                <div key={`${item.rank}-${item.createdAt}`}>{rowContent}</div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-white/45">
        Share your result and challenge friends to beat your score.
      </div>
    </section>
  );
}