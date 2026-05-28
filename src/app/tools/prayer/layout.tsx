// src/app/tools/prayer/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prayer Generator — Write a Personal Prayer in Seconds | Faith Companion AI",
  description:
    "Generate a personal, Scripture-grounded prayer for any situation in seconds. Free AI prayer generator for peace, healing, strength, family, and daily faith — any tone, any need.",
  keywords: [
    "AI prayer generator",
    "Christian prayer app",
    "daily prayer online",
    "personalized Bible prayer",
    "Scripture-based prayer",
    "prayer for anxiety",
    "prayer for healing",
    "Faith Companion AI prayer",
  ],
  alternates: { canonical: "/tools/prayer" },
  openGraph: {
    title: "AI Prayer Generator — Faith Companion AI",
    description:
      "Generate a personal, Scripture-grounded prayer in seconds. Free AI prayer tool for any situation.",
    url: "https://faithcompanionai.com/tools/prayer",
    siteName: "Faith Companion AI",
    type: "website",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI Prayer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prayer Generator — Faith Companion AI",
    description: "Personal, Scripture-grounded prayers for any need.",
    images: ["/brand/og-quiz.png"],
  },
};

export default function PrayerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
