// src/app/tools/devotional/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Devotional Generator — Faith Companion AI",
  description:
    "Generate a personalized Christian devotional with Scripture, reflection, prayer, and action steps. Free AI devotional app for daily spiritual growth.",
  keywords: [
    "Christian devotional app",
    "AI devotional generator",
    "daily devotional online",
    "Bible devotional",
    "Christian devotional app",
    "Scripture reflection",
    "daily Bible study",
    "Faith Companion AI devotional",
  ],
  alternates: { canonical: "/tools/devotional" },
  openGraph: {
    title: "Daily Devotional Generator — Faith Companion AI",
    description:
      "AI-generated devotionals with Scripture, reflection, prayer, and action steps. Free for daily spiritual growth.",
    url: "https://faithcompanionai.com/tools/devotional",
    siteName: "Faith Companion AI",
    type: "website",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI Devotional" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Devotional Generator — Faith Companion AI",
    description: "AI devotionals with Scripture, reflection, prayer, and action steps.",
    images: ["/brand/og-quiz.png"],
  },
};

export default function DevotionalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
