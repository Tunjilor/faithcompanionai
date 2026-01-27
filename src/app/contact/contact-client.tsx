"use client";

import React, { useState } from "react";

export default function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: wire to /api/contact later
      await new Promise((r) => setTimeout(r, 450));
      setToast("Message saved (stub) ✅");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setToast("Something went wrong");
    } finally {
      setLoading(false);
      window.setTimeout(() => setToast(null), 2200);
    }
  }

  return (
    <div className="fc-surface rounded-2xl p-6">
      {toast ? (
        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
          {toast}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-white/80">Name</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-white/80">Email</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="support@faithcompanionai.com"
            type="email"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-white/80">Message</label>
          <textarea
            className="mt-2 min-h-[140px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/20"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send Message"}
        </button>

        <div className="text-xs text-white/45">
          Note: this is currently a stub form until you wire an API route (or email provider).
        </div>
      </form>
    </div>
  );
}
