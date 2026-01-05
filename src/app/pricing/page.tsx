import type { Metadata } from "next";
import PricingClient from "./pricing-client";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose a plan for Faith Companion AI: Free, Monthly, Yearly, or Lifetime. Unlock unlimited verses, prayers, devotionals, and premium quiz packs.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Faith Companion AI — Pricing",
    description: "Unlock premium tools, unlimited use, and AI-powered quiz packs.",
    url: "https://faithcompanionai.com/pricing",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith Companion AI — Pricing",
    description: "Unlock premium tools, unlimited use, and AI-powered quiz packs.",
    images: ["/brand/og-quiz.png"],
  },
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <PricingClient />
    </main>
  );
}
