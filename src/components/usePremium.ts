"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "fc_premium";

export default function usePremium() {
  const [isPremium, setIsPremium] = useState(false);

  // Read on mount + when storage changes (other tabs)
  useEffect(() => {
    const read = () => {
      try {
        setIsPremium(localStorage.getItem(KEY) === "true");
      } catch {
        setIsPremium(false);
      }
    };

    read();

    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) read();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
