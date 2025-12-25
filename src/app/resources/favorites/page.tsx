"use client";

import { useEffect, useState } from "react";
import BrandHeader from "@/components/BrandHeader";

type FavoriteItem = {
  id: string;
  type: "Verse" | "Prayer" | "Devotional";
  title: string;
  preview: string;
  createdAt: string;
};

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  // Temporary: localStorage demo (until Supabase DB is wired)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("fc_favorites");
      if (!raw) return;
      const parsed = JSON.parse(raw) as FavoriteItem[];
      setItems(parsed);
    } catch {
      // ignore
    }
  }, []);

  return (
    <main className="min-h-screen px-6 py-10 app-bg">
      <div className="max-w-6xl mx-auto">
        <BrandHeader
          title="Favorites"
          subtitle="Your saved verses, prayers, and devotionals in one place."
        />

        <div className="brand-surface p-8">
          {items.length === 0 ? (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">No favorites yet</h2>
              <p className="text-slate-700 mt-2 max-w-2xl">
                Once we connect Supabase, this page will automatically show each user’s saved content.
                For now, it’s ready and working—just waiting on data.
              </p>

              <div className="mt-6 rounded-2xl border border-black/10 bg-white/80 backdrop-blur p-5 text-slate-700">
                <div className="font-semibold">Next step</div>
                <div className="text-sm mt-1">
                  Save content from Verse / Prayer / Devotional pages into a DB table like{" "}
                  <code className="px-2 py-1 rounded bg-black/5">saved_content</code>.
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-600">{it.type}</div>
                      <div className="text-lg font-extrabold text-slate-900 mt-1">{it.title}</div>
                      <div className="text-sm text-slate-700 mt-2">{it.preview}</div>
                    </div>
                    <div className="text-xs text-slate-500">{it.createdAt}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
