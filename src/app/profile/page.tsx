"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function ProfilePage() {
  const me = useUser();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Display name form
  const [nameInput, setNameInput] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Password form
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Load current profile
  useEffect(() => {
    fetch("/api/me/profile", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return;
        setDisplayName(d.displayName ?? "");
        setNameInput(d.displayName ?? "");
        setHasPassword(!!d.hasPassword);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Redirect unauthenticated users once context loads
  useEffect(() => {
    if (me.authed === false && me.userId === null && loaded) {
      router.replace("/login");
    }
  }, [me.authed, me.userId, loaded, router]);

  async function saveDisplayName(e: React.FormEvent) {
    e.preventDefault();
    setNameMsg(null);
    setNameSaving(true);
    try {
      const res = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: nameInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNameMsg({ ok: false, text: data.error || "Failed to save." });
      } else {
        setDisplayName(data.displayName ?? "");
        setNameMsg({ ok: true, text: "Display name saved." });
      }
    } catch {
      setNameMsg({ ok: false, text: "Network error. Try again." });
    } finally {
      setNameSaving(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (newPw !== confirmPw) {
      setPwMsg({ ok: false, text: "Passwords do not match." });
      return;
    }
    if (newPw.length < 8) {
      setPwMsg({ ok: false, text: "Password must be at least 8 characters." });
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPw, currentPassword: currentPw || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMsg({ ok: false, text: data.error || "Failed to save." });
      } else {
        setHasPassword(true);
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        setPwMsg({ ok: true, text: "Password saved. You can now log in with email + password." });
      }
    } catch {
      setPwMsg({ ok: false, text: "Network error. Try again." });
    } finally {
      setPwSaving(false);
    }
  }

  if (!loaded) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <div className="text-sm text-white/50">Loading profile…</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10 md:px-6 md:py-12">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-orange-300 hover:text-orange-200">
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-white">Profile &amp; Settings</h1>
        <p className="mt-1 text-sm text-white/60">{me.email}</p>
      </div>

      {/* ── Display Name ─────────────────────────────────────────── */}
      <section className="rounded-[24px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Display Name</h2>
        <p className="mt-1 text-sm text-white/60">
          Shown in the navbar instead of your email address. Letters, numbers, spaces, hyphens, and underscores only.
        </p>

        <form onSubmit={saveDisplayName} className="mt-4 space-y-3">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="e.g. Sarah, JohnDoe, FaithWalker"
            maxLength={32}
            className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={nameSaving}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {nameSaving ? "Saving…" : "Save display name"}
            </button>
            {displayName && (
              <span className="text-xs text-white/50">Current: <span className="text-white/80">{displayName}</span></span>
            )}
          </div>
          {nameMsg && (
            <p className={`text-sm ${nameMsg.ok ? "text-emerald-400" : "text-red-400"}`}>{nameMsg.text}</p>
          )}
        </form>
      </section>

      {/* ── Password Login ───────────────────────────────────────── */}
      <section className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">
          {hasPassword ? "Change Password" : "Set a Password"}
        </h2>
        <p className="mt-1 text-sm text-white/60">
          {hasPassword
            ? "Update your password. Magic link login still works too."
            : "Add a password so you can log in from any device without needing your email (useful on library or shared computers). Magic link login still works."}
        </p>

        <form onSubmit={savePassword} className="mt-4 space-y-3">
          {hasPassword && (
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">Current password</label>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">
              {hasPassword ? "New password" : "Password"} <span className="text-white/40">(min 8 characters)</span>
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1">Confirm password</label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={pwSaving || !newPw}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {pwSaving ? "Saving…" : hasPassword ? "Update password" : "Set password"}
          </button>
          {pwMsg && (
            <p className={`text-sm ${pwMsg.ok ? "text-emerald-400" : "text-red-400"}`}>{pwMsg.text}</p>
          )}
        </form>
      </section>

      <p className="mt-6 text-center text-xs text-white/30">
        Magic link login always works regardless of whether a password is set.
      </p>
    </main>
  );
}
