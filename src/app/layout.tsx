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
      logo: "https://faithcompanionai.com/logo.png",
      description:
        "A faith ecosystem of free AI-powered Christian tools for prayer, Bible study, and giving",
      sameAs: [],
      foundingDate: "2024",
      keywords: "Christian AI, faith tools, AI prayer, Bible verse generator, tithe calculator",
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
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Faith Companion AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Faith Companion AI is a free ecosystem of Christian AI tools including an AI prayer generator, Bible verse generator, and tithe calculator — all designed to support your spiritual growth.",
          },
        },
        {
          "@type": "Question",
          name: "What is the best AI app for Christians?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Faith Companion AI offers a suite of free tools built specifically for Christians — AI prayer writing, Bible verse discovery by topic and mood, and a biblical tithe calculator. All free, no subscription required.",
          },
        },
        {
          "@type": "Question",
          name: "Can AI help with Bible study?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Our AI Bible verse generator finds scriptures by topic, mood, keyword, and translation, while our faith companion AI can discuss passages, provide context, and suggest reflection questions.",
          },
        },
        {
          "@type": "Question",
          name: "Is there a free Christian AI tool?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. All Faith Companion AI tools are completely free — including the AI prayer generator, random Bible verse generator, and tithe calculator. No account required to get started.",
          },
        },
        {
          "@type": "Question",
          name: "How can AI improve my prayer life?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AI can help when you struggle to find the right words. Our prayer generator creates personalized, scripture-inspired prayers for any situation — helping you pray with more depth, consistency, and confidence.",
          },
        },
      ],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://faithcompanionai.com"),
  title: {
    default: "Faith Companion AI — Free Christian AI Tools for Prayer, Bible & Tithing",
    template: "%s | Faith Companion AI",
  },
  description:
    "Your complete faith ecosystem powered by AI. Free tools for prayer generation, Bible verse discovery, tithe calculation, and daily devotion. The best Christian AI companion for spiritual growth.",
  applicationName: "Faith Companion AI",
  keywords: [
    "faith companion AI",
    "Christian AI app",
    "AI Bible study",
    "AI spiritual companion",
    "Christian AI tools",
    "AI prayer and Bible app",
    "faith AI tools",
    "free Christian AI",
    "Bible AI chat",
    "AI devotional",
    "AI tools for Christians",
    "best Christian AI apps 2025",
    "AI Bible study tools",
    "AI prayer app free",
    "AI faith companion for daily devotion",
    "Christian AI chatbot",
    "AI-powered scripture study",
    "digital faith companion",
    "AI devotional generator",
    "faith-based AI assistant",
    "AI tithe calculator",
    "AI Bible verse generator",
    "AI prayer generator",
    "Christian spiritual growth app",
    "online Bible study AI",
    "AI church tools",
    "sermon preparation AI",
    "faith technology",
    "Christian technology tools",
    "AI for church",
    "Bible study assistant AI",
    "daily devotional AI",
    "scripture study AI",
    "Christian AI ecosystem",
    "faith ecosystem AI tools",
    "free Christian AI tools 2025",
  ],
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
    type: "website",
    url: "https://faithcompanionai.com",
    siteName: "Faith Companion AI",
    title: "Faith Companion AI — Free Christian AI Tools for Prayer, Bible & Tithing",
    description:
      "Your complete faith ecosystem powered by AI. Free tools for prayer generation, Bible verse discovery, tithe calculation, and daily devotion.",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith Companion AI — Free Christian AI Tools for Prayer, Bible & Tithing",
    description:
      "Your complete faith ecosystem powered by AI. Free tools for prayer, Bible verses, and tithing.",
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
