import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bible Search — Find Verses by Reference or Keyword | Faith Companion AI",
  description:
    "Search Scripture by reference (e.g. John 3:16) or keyword (e.g. peace, faith, love). Free Bible verse search with KJV, WEB, and ASV translations.",
  keywords: [
    "Bible search",
    "search Bible verses",
    "Bible verse lookup",
    "find Bible verse",
    "Scripture search",
    "Bible keyword search",
    "John 3:16",
    "Faith Companion AI Bible",
  ],
  alternates: { canonical: "/tools/bible-search" },
  openGraph: {
    title: "Bible Search — Faith Companion AI",
    description: "Search Scripture by reference or keyword. Free Bible verse lookup tool.",
    url: "https://faithcompanionai.com/tools/bible-search",
    siteName: "Faith Companion AI",
    type: "website",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI Bible Search" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Search — Faith Companion AI",
    description: "Search Scripture by reference or keyword.",
    images: ["/brand/og-quiz.png"],
  },
};

export default function BibleSearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
