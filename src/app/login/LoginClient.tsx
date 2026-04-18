// src/app/login/LoginClient.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginClient() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devMagicLink, setDevMagicLink] = useState<string | null>(null);

  const error = searchParams.get("error");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setDevMagicLink(null);

    try {
      const res = await fetch("/api/auth/magic/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      setMessage("Check your email for your sign-in link ✉️");

      if (data?.devMagicLink) {
        setDevMagicLink(data.devMagicLink);
      }
    } catch (err: any) {
      setMessage(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function getErrorText(code: string | null) {
    switch (code) {
      case "missing_token":
        return "That login link is missing a token.";
      case "invalid_link":
        return "That login link is invalid.";
      case "link_used":
        return "That login link has already been used.";
      case "link_expired":
        return "That login link has expired. Please request a new one.";
      case "verify_failed":
        return "We could not verify your login link. Please try again.";
      case "missing_session_secret":
        return "The sign-in system is not fully configured yet.";
      default:
        return null;
    }
  }

  const errorText = getErrorText(error);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
            Faith Companion AI Sign In
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Save your faith journey and come back to what matters
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
            Sign in with your email to save meaningful verses, prayers, and devotionals.
            No password required.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>

          {errorText && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorText}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {devMagicLink && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="font-semibold">Development shortcut</div>
              <p className="mt-1 text-amber-800">
                Since no email provider is configured, use this sign-in link directly:
              </p>
              <a
                href={devMagicLink}
                className="mt-3 block break-all font-medium underline"
              >
                {devMagicLink}
              </a>
            </div>
          )}

          <p className="mt-6 text-xs leading-6 text-white/50">
            By signing in, you can save your faith journal and access your account across sessions.
          </p>
        </section>

        <aside className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8">
          <h2 className="text-2xl font-bold text-white">Why create an account?</h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-[22px] border border-white/10 bg-black/15 p-5">
              <div className="text-base font-semibold text-white">Save meaningful moments</div>
              <p className="mt-2 text-sm leading-7 text-white/70">
                Keep verses, prayers, and devotionals you want to revisit later.
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-black/15 p-5">
              <div className="text-base font-semibold text-white">Build your faith journal</div>
              <p className="mt-2 text-sm leading-7 text-white/70">
                Turn one-time encouragement into a more consistent spiritual rhythm.
              </p>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-black/15 p-5">
              <div className="text-base font-semibold text-white">Upgrade whenever you are ready</div>
              <p className="mt-2 text-sm leading-7 text-white/70">
                Free users can explore first. Premium unlocks unlimited usage and saved journal power.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[22px] border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold text-white/80">New here?</div>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Start free with Verse, Prayer, or Devotional, then create an account when you want to save your journey.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools/verse"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Try Verse
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Premium
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}