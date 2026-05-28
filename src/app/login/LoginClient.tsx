// src/app/login/LoginClient.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Tab = "magic" | "password";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("magic");

  // Magic link state
  const [email, setEmail] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicMessage, setMagicMessage] = useState<string | null>(null);
  const [devMagicLink, setDevMagicLink] = useState<string | null>(null);

  // Password login state
  const [pwEmail, setPwEmail] = useState("");
  const [pwPassword, setPwPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);

  const error = searchParams.get("error");
  const resetSuccess = searchParams.get("reset") === "success";

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMagicLoading(true);
    setMagicMessage(null);
    setDevMagicLink(null);
    try {
      const res = await fetch("/api/auth/magic/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setMagicMessage("Check your email for your sign-in link ✉️");
      if (data?.devMagicLink) setDevMagicLink(data.devMagicLink);
    } catch (err: any) {
      setMagicMessage(err.message || "Login failed");
    } finally {
      setMagicLoading(false);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pwEmail, password: pwPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data?.error || "Login failed.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setPwLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotError(null);
    setForgotMessage(null);
    setDevResetLink(null);
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/password/reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotError(data.error || "Something went wrong.");
        return;
      }
      setForgotMessage("Check your email for a password reset link ✉️");
      if (data?.devResetLink) setDevResetLink(data.devResetLink);
    } catch {
      setForgotError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  }

  function getErrorText(code: string | null) {
    switch (code) {
      case "missing_token": return "That login link is missing a token.";
      case "invalid_link": return "That login link is invalid.";
      case "link_used": return "That login link has already been used.";
      case "link_expired": return "That login link has expired. Please request a new one.";
      case "verify_failed": return "We could not verify your login link. Please try again.";
      case "missing_session_secret": return "The sign-in system is not fully configured yet.";
      default: return null;
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

          {/* Tabs */}
          <div className="mt-6 flex rounded-2xl border border-white/10 bg-black/30 p-1">
            <button
              type="button"
              onClick={() => setTab("magic")}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${tab === "magic" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"}`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => setTab("password")}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${tab === "password" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"}`}
            >
              Password
            </button>
          </div>

          {errorText && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorText}
            </div>
          )}

          {resetSuccess && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Your password has been updated. You can now sign in below.
            </div>
          )}

          {/* Magic link form */}
          {tab === "magic" && (
            <form onSubmit={handleMagicLink} className="mt-6 space-y-4">
              <p className="text-sm leading-6 text-white/70">
                Enter your email and we&apos;ll send a one-click sign-in link. No password required.
              </p>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80">
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
                disabled={magicLoading}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {magicLoading ? "Sending…" : "Send Magic Link"}
              </button>
              {magicMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  {magicMessage}
                </div>
              )}
              {devMagicLink && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <div className="font-semibold">Development shortcut</div>
                  <a href={devMagicLink} className="mt-2 block break-all font-medium underline">
                    {devMagicLink}
                  </a>
                </div>
              )}
            </form>
          )}

          {/* Password form */}
          {tab === "password" && !forgotMode && (
            <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
              <p className="text-sm leading-6 text-white/70">
                Log in with your email and password. You can set a password in{" "}
                <Link href="/profile" className="text-orange-300 hover:text-orange-200 underline">
                  Profile &amp; Settings
                </Link>{" "}
                after signing in via magic link.
              </p>
              <div>
                <label htmlFor="pw-email" className="block text-sm font-medium text-white/80">
                  Email address
                </label>
                <input
                  id="pw-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={pwEmail}
                  onChange={(e) => setPwEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="pw-password" className="block text-sm font-medium text-white/80">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setForgotEmail(pwEmail); setForgotMode(true); setForgotMessage(null); setForgotError(null); setDevResetLink(null); }}
                    className="text-xs text-orange-300 hover:text-orange-200 underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="pw-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={pwPassword}
                  onChange={(e) => setPwPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={pwLoading}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {pwLoading ? "Signing in…" : "Sign In"}
              </button>
              {pwError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {pwError}
                </div>
              )}
              <p className="text-center text-xs text-white/40">
                Don&apos;t have a password yet?{" "}
                <button type="button" onClick={() => setTab("magic")} className="underline hover:text-white/60">
                  Use magic link instead
                </button>
              </p>
            </form>
          )}

          {/* Forgot password form */}
          {tab === "password" && forgotMode && (
            <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="text-sm text-white/50 hover:text-white/80"
                >
                  ← Back
                </button>
                <h2 className="text-sm font-semibold text-white">Reset your password</h2>
              </div>
              <p className="text-sm leading-6 text-white/70">
                Enter your email and we&apos;ll send you a link to set a new password.
              </p>
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-white/80">
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={forgotLoading}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {forgotLoading ? "Sending…" : "Send reset link"}
              </button>
              {forgotMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  {forgotMessage}
                </div>
              )}
              {devResetLink && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <div className="font-semibold">Development shortcut</div>
                  <a href={devResetLink} className="mt-2 block break-all font-medium underline">
                    {devResetLink}
                  </a>
                </div>
              )}
              {forgotError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {forgotError}
                </div>
              )}
            </form>
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
              <Link href="/tools/verse"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
                Try Verse
              </Link>
              <Link href="/pricing"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                View Premium
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
