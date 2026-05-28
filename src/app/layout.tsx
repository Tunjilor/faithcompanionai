import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SpiritualAssistant } from "@/components/SpiritualAssistant";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { ReferralTracker } from "@/components/ReferralTracker";
import { UserProvider } from "@/context/UserContext";
import Script from "next/script";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Analytics } from "@vercel/analytics/react";

const GA_ID = "G-5WYYE098DH";

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://faithcompanionai.com/#organization",
      name: "Faith Companion AI",
      url: "https://faithcompanionai.com",
      description:
        "Scripture-based verses, prayers, devotionals, and Bible quizzes for daily faith growth.",
    },
    {
      "@type": "WebSite",
      "@id": "https://faithcompanionai.com/#website",
      url: "https://faithcompanionai.com",
      name: "Faith Companion AI",
      publisher: { "@id": "https://faithcompanionai.com/#organization" },
    },
    {
      "@type": "WebApplication",
      "@id": "https://faithcompanionai.com/#webapp",
      name: "Faith Companion AI",
      url: "https://faithcompanionai.com",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description:
        "Daily Bible verses, personalized prayers, devotionals, and faith quizzes — grounded in Scripture.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://faithcompanionai.com"),
  title: { default: "Faith Companion AI", template: "%s | Faith Companion AI" },
  description: "Scripture-based verses, prayers, devotionals, and Bible quizzes designed to support your daily walk with God.",
  applicationName: "Faith Companion AI",
  keywords: ["Christian AI","Bible verses by topic","Christian prayer tool","AI devotional","Bible quiz","daily encouragement","faith journal","Christian app","Scripture encouragement","prayer generator"],
  authors: [{ name: "Faith Companion AI" }],
  creator: "Faith Companion AI",
  publisher: "Faith Companion AI",
  category: "Religion & Spirituality",
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website", url: "https://faithcompanionai.com", siteName: "Faith Companion AI",
    title: "Faith Companion AI",
    description: "Scripture-based verses, prayers, devotionals, and Bible quizzes for daily encouragement and growth.",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI" }],
  },
  twitter: {
    card: "summary_large_image", title: "Faith Companion AI",
    description: "Scripture-based verses, prayers, devotionals, and Bible quizzes for daily encouragement and growth.",
    images: ["/brand/og-quiz.png"],
  },
  robots: {
    index: true, follow: true, nocache: false,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {},
  other: {
    "theme-color": "#6d28d9",
    "color-scheme": "dark",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Faith Companion",
  },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#6d28d9",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-locale") ?? "en";
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
      </head>
      <body className="min-h-screen bg-fc text-fc">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <div className="fc-bg" />
        <UserProvider>
          <div className="fixed right-4 top-3 z-50">
            <LanguageSwitcher />
          </div>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
            {children}
          </main>
          <Footer />
          <SpiritualAssistant />
          <ExitIntentModal />
          <ReferralTracker />
          <AddToHomeScreen />
          <ServiceWorkerRegistration />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  );
}
