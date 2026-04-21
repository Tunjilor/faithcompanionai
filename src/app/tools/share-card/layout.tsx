import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verse Share Card Generator — Create Shareable Bible Images | Faith Companion AI",
  description:
    "Turn any Bible verse into a beautiful, shareable image card. Download as PNG for Instagram, Facebook, Twitter/X, or share directly from your phone. Free verse card maker.",
  keywords: [
    "Bible verse card",
    "shareable Bible image",
    "verse image generator",
    "Christian Instagram post",
    "scripture card maker",
    "Bible verse download",
    "Faith Companion AI",
  ],
  alternates: { canonical: "/tools/share-card" },
  openGraph: {
    title: "Verse Share Card Generator — Faith Companion AI",
    description:
      "Turn any Bible verse into a beautiful shareable image. Free PNG download for Instagram, Facebook, and Twitter/X.",
    url: "https://faithcompanionai.com/tools/share-card",
    siteName: "Faith Companion AI",
    type: "website",
    images: [
      {
        url: "/api/og/verse",
        width: 1200,
        height: 630,
        alt: "Faith Companion AI Verse Card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verse Share Card Generator — Faith Companion AI",
    description: "Turn any Bible verse into a beautiful shareable image.",
    images: ["/api/og/verse"],
  },
};

export default function ShareCardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
