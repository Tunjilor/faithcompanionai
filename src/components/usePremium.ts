// src/components/usePremium.ts
"use client";

import { useCallback, useEffect, useState } from "react";

type MeResponse = {
  premium: boolean;
  premiumUntil: string | null;
  email?: string;
};

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const json = (await res.json()) as MeResponse;
      setMe(json);
      setIsPremium(Boolean(json?.premium));
    } catch {
      setMe({ premium: false, premiumUntil: null });
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { isPremium, loading, me, refresh };
}