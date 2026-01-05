import type { Metadata, Viewport } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpiritualAssistant from "@/components/SpiritualAssistant";

export const metadata: Metadata = {
  metadataBase: new URL("https://faithcompanionai.com"),
  title: {
    default: "Faith Companion AI",
    template: "%s | Faith Companion AI",
  },
  description: "Personalized Bible verses, prayers, and devotionals — grounded in Scripture.",
  applicationName: "Faith Companion AI",
  alternates: { canonical: "/" },

  icons: {
    icon: [
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/icon-180.png", sizes: "180x180", type: "image/png" }],
  },

  openGraph: {
    type: "website",
    url: "https://faithcompanionai.com",
    siteName: "Faith Companion AI",
    title: "Faith Companion AI",
    description: "Daily verses, prayers, devotionals, and Bible quizzes.",
    images: [
      { url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI" },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Faith Companion AI",
    description: "Daily verses, prayers, devotionals, and Bible quizzes.",
    images: ["/brand/og-quiz.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07070a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-fc text-fc">
        <div className="fc-bg" />
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">{children}</main>
        <Footer />
        <SpiritualAssistant />
      </body>
    </html>
  );
}
