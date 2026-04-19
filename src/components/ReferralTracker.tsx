"use client";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

const STORAGE_KEY = "fcai_ref";

export function ReferralTracker() {
  const user = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) localStorage.setItem(STORAGE_KEY, ref);

    const storedRef = localStorage.getItem(STORAGE_KEY);
    if (!storedRef) return;

    const signedIn = user.signedIn || user.authed;
    if (!signedIn) return;

    fetch("/api/me/referral", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ referrerId: storedRef }),
    })
      .then((res) => { if (res?.ok) localStorage.removeItem(STORAGE_KEY); })
      .catch(() => {});
  }, [user.signedIn, user.authed]);

  return null;
}

export default ReferralTracker;
