// src/components/ReferralTracker.tsx
// Detects ?ref=[userId] in URL, stores it, then records it after login.
"use client";

import { useEffect } from "react";

const STORAGE_KEY = "fcai_ref";

export default function ReferralTracker() {
  useEffect(() => {
    // 1. Capture ref from URL and persist it
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem(STORAGE_KEY, ref);
    }

    // 2. If signed in and we have a stored ref, record it
    const storedRef = localStorage.getItem(STORAGE_KEY);
    if (!storedRef) return;

    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        const signedIn = data?.signedIn || data?.authed;
        if (!signedIn) return;
        // Already has a referrer recorded — clear and move on
        if (data?.referredBy) { localStorage.removeItem(STORAGE_KEY); return; }

        return fetch("/api/me/referral", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ referrerId: storedRef }),
        });
      })
      .then((res) => {
        if (res?.ok) localStorage.removeItem(STORAGE_KEY);
      })
      .catch(() => {});
  }, []);

  return null;
}
