// src/app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import UpgradeCTA from "@/components/UpgradeCTA";

type MeResponse = {
  signedIn?: boolean;
  authed?: boolean;
  isPremium?: boolean;
  premium?: boolean;
  premiumUntil?: string | null;
  email?: string | null;
  actorKey?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  guest?: {
    id?: string;
    createdAt?: number;
    trial?: {
      daysSinceFirstSeen?: number;
      isWithinTrial?: boolean;
    };
  } | null;
};

type SavedItem = {
  id: string;
  type: "answer" | "prayer" | "verse" | "plan_note";
  title: string | null;
  content: string;
  reference: string | null;
  createdAt: string;
};

function isPremiumActive(me: MeResponse | null) {
  const premiumFlag = !!(me?.isPremium ?? me?.premium);
  if (!premiumFlag) return false;
  if (!me?.premiumUntil) return true;
  return new Date(me.premiumUntil).getTime() > Date.now();
}

function formatDate(input: string) {
  return new Date(input).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncate(text: string, max = 180) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export default function DashboardPage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError("");

        const meRes = await fetch("/api/me", { cache: "no-store" });
        const meData = meRes.ok ? await meRes.json() : null;

        if (cancelled) return;
        setMe(meData);

        const signedIn = !!(meData?.signedIn ?? meData?.authed);

        if (signedIn) {
          const savedRes = await fetch("/api/saved", { cache: "no-store" });
          const savedData = savedRes.ok ? await savedRes.json() : { items: [] };

          if (!cancelled) {
            setSavedItems(savedData.items || []);
          }
        } else {
          setSavedItems([]);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load your dashboard right now.");
          setSavedItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setError("");

      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to log out.");
      }

      window.location.href = "/login";
    } catch (err: any) {
      setError(err?.message || "Failed to log out.");
      setLoggingOut(false);
    }
  }

  const signedIn = !!(me?.signedIn ?? me?.authed);
  const premiumActive = isPremiumActive(me);

  const counts = useMemo(() => {
    return {
      total: savedItems.length,
      verses: savedItems.filter((x) => x.type === "verse").length,
      prayers: savedItems.filter((x) => x.type === "prayer").length,
      answers: savedItems.filter((x) => x.type === "answer").length,
    };
  }, [savedItems]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-white/70 backdrop-blur">
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-medium text-white/60">Dashboard</div>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              {signedIn ? "Welcome back" : "Your faith journey starts here"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
              {signedIn
                ? premiumActive
                  ? "Your premium faith journal is active. Revisit what matters, stay consistent, and keep growing."
                  : "You’re signed in. Upgrade to Premium to save your journey, unlock unlimited use, and build your personal faith journal."
                : "Sign in to save your spiritual journey, revisit meaningful verses, and build your personal faith journal."}
            </p>

            {signedIn && me?.email && (
              <div className="mt-3 text-sm text-white/50">{me.email}</div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/tools/verse"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              New Verse
            </Link>

            <Link
              href="/tools"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Open Tools
            </Link>

            {signedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Plan</div>
          <div className="mt-2 text-2xl font-bold text-white">
            {premiumActive ? "Premium" : signedIn ? "Free Account" : "Guest"}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Saved items</div>
          <div className="mt-2 text-2xl font-bold text-white">
            {signedIn ? counts.total : "—"}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Saved verses</div>
          <div className="mt-2 text-2xl font-bold text-white">
            {signedIn ? counts.verses : "—"}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Billing state</div>
          <div className="mt-2 text-2xl font-bold text-white">
            {premiumActive ? "Active" : signedIn ? "Free" : "Guest"}
          </div>
        </div>
      </section>

      {signedIn && (
        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-white">Billing & plan</h2>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <p>
                <span className="font-semibold text-white">Current plan:</span>{" "}
                {premiumActive ? "Premium" : "Free"}
              </p>

              {premiumActive && me?.premiumUntil && (
                <p>
                  <span className="font-semibold text-white">Premium until:</span>{" "}
                  {formatDate(me.premiumUntil)}
                </p>
              )}

              {me?.customerId && (
                <p>
                  <span className="font-semibold text-white">Customer record:</span> Connected
                </p>
              )}

              {me?.subscriptionId && (
                <p>
                  <span className="font-semibold text-white">Subscription:</span> Active record found
                </p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              >
                {premiumActive ? "View plan options" : "Upgrade to Premium"}
              </Link>

              <a
                href="mailto:support@faithcompanionai.com?subject=Billing%20Help%20-%20Faith%20Companion%20AI"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Billing support
              </a>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-white">Support</h2>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <p>
                Need help with your account, access, saved content, or billing?
              </p>
              <p>
                The fastest path is to email support with the email tied to your account.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Contact support
              </Link>

              <Link
                href="/faq"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Read FAQ
              </Link>
            </div>
          </div>
        </section>
      )}

      {!signedIn && (
        <section className="mt-8">
          <UpgradeCTA
            variant="dashboard"
            title="Create a free account to keep your journey"
            description="Sign in to save meaningful verses later, then upgrade when you're ready for unlimited guidance and your full faith journal."
            primaryHref="/login"
            primaryLabel="Sign in"
            secondaryHref="/pricing"
            secondaryLabel="See Premium"
            showFeatures={false}
          />
        </section>
      )}

      {signedIn && !premiumActive && (
        <section className="mt-8">
          <UpgradeCTA
            variant="dashboard"
            title="Unlock your full faith journal"
            description="Premium removes interruptions, unlocks unlimited use, and keeps your spiritual journey organized in one place."
            primaryHref="/pricing"
            primaryLabel="Upgrade to Premium"
            secondaryHref="/tools/verse"
            secondaryLabel="Keep Exploring"
            showFeatures
          />
        </section>
      )}

      <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Saved journey</h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Revisit your most meaningful verses, prayers, and devotional moments.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/tools/verse"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Generate More
            </Link>

            {!premiumActive && (
              <Link
                href="/pricing"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Upgrade
              </Link>
            )}
          </div>
        </div>

        {!signedIn ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-white/10 bg-black/10 p-6 text-sm leading-7 text-white/70">
            Sign in first to start saving your verses and building a personal faith journal.
          </div>
        ) : savedItems.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-white/10 bg-black/10 p-6 text-sm leading-7 text-white/70">
            Nothing saved yet. Generate a verse or prayer and save it to start building your faith journal.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {savedItems.map((item) => (
              <article
                key={item.id}
                className="rounded-[24px] border border-white/10 bg-black/15 p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
                    {item.type}
                  </div>
                  <div className="text-xs text-white/50">
                    {formatDate(item.createdAt)}
                  </div>
                </div>

                <h3 className="mt-3 text-base font-semibold text-white">
                  {item.title || "Saved item"}
                </h3>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">
                  {truncate(item.content)}
                </p>

                {item.reference && (
                  <div className="mt-3 text-xs text-white/50">
                    {item.reference}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}