// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpiritualAssistant from "@/components/SpiritualAssistant";
import ExitIntentModal from "@/components/ExitIntentModal";
import ReferralTracker from "@/components/ReferralTracker";

// ── Google AdSense ────────────────────────────────────────────────────────────
// When your AdSense account is approved, paste this inside <head> below:
//
//   <Script
//     async
//     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
//     crossOrigin="anonymous"
//     strategy="afterInteractive"
//   />
//
// Replace ca-pub-XXXXXXXXXXXXXXXX with your real publisher ID from:
//   AdSense dashboard → Account → Account information → Publisher ID
// Also update the dataAdClient prop in each <AdSenseSlot /> component.
// ─────────────────────────────────────────────────────────────────────────────

const GA_ID = "G-5WYYE098DH";

export const metadata: Metadata = {
  metadataBase: new URL("https://faithcompanionai.com"),
  title: {
    default: "Faith Companion AI",
    template: "%s | Faith Companion AI",
  },
  description:
    "Scripture-based verses, prayers, devotionals, and Bible quizzes designed to support your daily walk with God.",
  applicationName: "Faith Companion AI",
  keywords: [
    "Christian AI",
    "Bible verses by topic",
    "Christian prayer tool",
    "AI devotional",
    "Bible quiz",
    "daily encouragement",
    "faith journal",
    "Christian app",
    "Scripture encouragement",
    "prayer generator",
  ],
  authors: [{ name: "Faith Companion AI" }],
  creator: "Faith Companion AI",
  publisher: "Faith Companion AI",
  category: "Religion & Spirituality",
  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/icon-180.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },

  openGraph: {
    type: "website",
    url: "https://faithcompanionai.com",
    siteName: "Faith Companion AI",
    title: "Faith Companion AI",
    description:
      "Scripture-based verses, prayers, devotionals, and Bible quizzes for daily encouragement and growth.",
    images: [
      {
        url: "/brand/og-quiz.png",
        width: 1200,
        height: 630,
        alt: "Faith Companion AI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Faith Companion AI",
    description:
      "Scripture-based verses, prayers, devotionals, and Bible quizzes for daily encouragement and growth.",
    images: ["/brand/og-quiz.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  verification: {
    // Add these later if needed:
    // google: "your-google-search-console-code",
  },

  other: {
    "theme-color": "#07070a",
    "color-scheme": "dark",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07070a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-fc text-fc">
        <div className="fc-bg" />
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
          {children}
        </main>
        <Footer />
        <SpiritualAssistant />
        <ExitIntentModal />
        <ReferralTracker />
      </body>
    </html>
  );
}