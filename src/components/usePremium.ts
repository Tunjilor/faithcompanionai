"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "isPremium";

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);

  const read = useCallback(() => {
    try {
      setIsPremium(localStorage.getItem(KEY) === "true");
    } catch {
      setIsPremium(false);
    }
  }, []);

  useEffect(() => {
    read();

    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) read();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [read]);

  const activatePremium = useCallback(() => {
    try {
      localStorage.setItem(KEY, "true");
    } catch {
      // ignore
    }
    setIsPremium(true);
  }, []);

  const deactivatePremium = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    setIsPremium(false);
  }, []);

  return { isPremium, activatePremium, deactivatePremium };
}
