// src/components/PremiumGate.tsx
"use client";

import React from "react";
import { useMe } from "@/lib/useMe";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode; // what to show if not premium
  loadingFallback?: React.ReactNode;
};

export default function PremiumGate({
  children,
  fallback,
  loadingFallback,
}: Props) {
  const { premium, loading } = useMe();

  if (loading) {
    return (
      <>
        {loadingFallback ?? (
          <div style={{ padding: 12, opacity: 0.8 }}>Checking access…</div>
        )}
      </>
    );
  }

  if (!premium) {
    return (
      <>
        {fallback ?? (
          <div style={{ padding: 12 }}>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>
              Premium required
            </div>
            <a href="/pricing" style={{ textDecoration: "underline" }}>
              Upgrade on Pricing
            </a>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
export { PremiumGate };
