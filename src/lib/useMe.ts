// src/lib/useMe.ts
"use client";

import { useEffect, useState } from "react";

export type MeResponse = {
  premium: boolean;
  premiumUntil: string | null;
  email?: string;
  customerId?: string | null;
  subscriptionId?: string | null;
};

export function useMe() {
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const json = (await res.json()) as MeResponse;
      setData(json);
    } catch {
      setData({ premium: false, premiumUntil: null });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { me: data, premium: !!data?.premium, loading, refresh };
}