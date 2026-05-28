// src/app/tools/verse/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Bible Verse Generator — Find Scripture for Any Topic | Faith Companion AI",
  description:
    "Find the perfect Bible verse for any topic — peace, anxiety, hope, healing, strength, grief, or guidance. Free AI-powered Scripture generator with references and daily encouragement.",
  keywords: [
    "Bible verse generator",
    "AI Bible verse",
    "Scripture for anxiety",
    "daily Bible verse",
    "Christian encouragement",
    "Faith Companion AI verse",
    "Bible verses for peace",
    "Bible verses for healing",
  ],
  alternates: { canonical: "/tools/verse" },
  openGraph: {
    title: "Bible Verse Generator — Faith Companion AI",
    description:
      "Get a Scripture-based verse for any topic in seconds. Free AI Bible verse generator for daily encouragement.",
    url: "https://faithcompanionai.com/tools/verse",
    siteName: "Faith Companion AI",
    type: "website",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI Verse" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Verse Generator — Faith Companion AI",
    description: "AI-powered Scripture for peace, hope, healing, and more.",
    images: ["/brand/og-quiz.png"],
  },
};

export default function VerseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
