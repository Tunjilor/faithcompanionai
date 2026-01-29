// src/app/pricing/page.tsx
import { Suspense } from "react";
import PricingClient from "./PricingClient";

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white/70">Loading…</div>}>
      <PricingClient />
    </Suspense>
  );
}

