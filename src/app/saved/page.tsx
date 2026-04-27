// src/app/saved/page.tsx

"use client";
import { useUser } from "@/context/UserContext";

import Link from "next/link";
import { useEffect, useState } from "react";

type SavedItem = {
  id: string;
  type: string;
  title: string | null;
  content: string;
  reference: string | null;
  createdAt: string;
};

type MeResponse = {
  signedIn?: boolean;
  isPremium?: boolean;
  premiumUntil?: string | null;
};

function isPremiumActive(me: MeResponse | null) {
  if (!me?.isPremium) return false;
  if (!me?.premiumUntil) return false;
  return new Date(me.premiumUntil).getTime() > Date.now();
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        const meRes = await fetch("/api/me", { cache: "no-store" });
        const meData = meRes.ok ? await meRes.json() : null;
        if (!cancelled) setMe(meData);

        const savedRes = await fetch("/api/saved", { cache: "no-store" });
        const savedText = await savedRes.text();

        let savedData: { items?: SavedItem[]; error?: string } = {};
        try {
          savedData = JSON.parse(savedText);
        } catch {
          savedData = { error: savedText || "Failed to load saved items." };
        }

        if (!savedRes.ok) {
          throw new Error(savedData.error || "Failed to load saved items.");
        }

        if (!cancelled) {
          setItems(savedData.items || []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to load saved items.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, []);

  const premiumActive = isPremiumActive(me);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Saved</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Revisit the verses, prayers, and reflections you’ve saved along your faith journey.
        </p>
      </header>

      {!me?.signedIn && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
          <div className="text-lg font-semibold">Sign in to view saved content</div>
          <p className="mt-2 text-sm text-white/70">
            Your saved content is tied to your account.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/login"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Sign in
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white"
            >
              See Premium
            </Link>
          </div>
        </div>
      )}

      {me?.signedIn && !premiumActive && (
        <div className="rounded-3xl border border-amber-300/20 bg-amber-500/10 p-6 text-white">
          <div className="text-lg font-semibold">Saved content is a Premium feature</div>
          <p className="mt-2 text-sm text-white/80">
            Upgrade to Premium to keep your favorite verses, prayers, and reflections in one place.
          </p>
          <div className="mt-4">
            <Link
              href="/pricing"
              className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      )}

      {me?.signedIn && premiumActive && (
        <div className="rounded-[28px] border border-white/10 bg-white p-6 shadow-2xl md:p-8">
          {loading ? (
            <div className="text-sm text-slate-600">Loading saved content...</div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-800">Nothing saved yet</div>
              <p className="mt-2 text-sm text-slate-600">
                Generate a verse, prayer, or devotional and save it to start building your personal faith journal.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/tools/verse"
                  className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
                >
                  Go to Verse
                </Link>
                <Link
                  href="/tools/prayer"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
                >
                  Go to Prayer
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-slate-900">
                        {item.title || "Saved item"}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                        {item.type}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {item.reference && (
                    <div className="mt-3 text-sm font-medium text-slate-700">
                      {item.reference}
                    </div>
                  )}

                  <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                    {item.content}
                  </pre>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

