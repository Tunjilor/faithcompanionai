"use client";

import { useEffect, useState } from "react";

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // TODO: replace with real premium check (Supabase/Stripe/PayPal)
    const v = localStorage.getItem("isPremium") === "true";
    setIsPremium(v);
  }, []);

  return { isPremium };
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

