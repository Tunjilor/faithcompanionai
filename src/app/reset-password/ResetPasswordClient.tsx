"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          This reset link is invalid or missing a token.
        </div>
        <Link href="/login" className="mt-4 block text-sm text-orange-300 hover:text-orange-200 underline">
          Back to sign in
        </Link>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password/reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login?reset=success"), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">
          <div className="font-semibold">Password updated!</div>
          <p className="mt-1 text-sm">Redirecting you to sign in…</p>
        </div>
        <Link href="/login" className="mt-4 block text-sm text-orange-300 hover:text-orange-200 underline">
          Go to sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-white">Set a new password</h1>
      <p className="mt-2 text-sm text-white/60">Enter your new password below.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80">
            New password <span className="text-white/40">(min 8 characters)</span>
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="mt-2 w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80">Confirm password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            className="mt-2 w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Saving…" : "Set new password"}
        </button>
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="text-orange-300 hover:text-orange-200 underline">
          Back to sign in
        </Link>
      </p>
    </main>
  );
}
