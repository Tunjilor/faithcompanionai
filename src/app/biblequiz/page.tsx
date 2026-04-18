// src/app/biblequiz/page.tsx

import type { Metadata } from "next";
import QuizClient from "./quiz-client";

export const metadata: Metadata = {
  title: "Bible Quiz Online — Free & Premium | Faith Companion AI",
  description:
    "Take a free Bible quiz online and test your Scripture knowledge. Multiple categories including General Bible, Women of the Bible, Parables, and Theology. Share your score and challenge friends.",
  keywords: [
    "Bible quiz online",
    "free Bible quiz",
    "Bible trivia",
    "Christian quiz app",
    "Scripture knowledge test",
    "Bible knowledge quiz",
    "online Bible trivia",
    "Faith Companion AI quiz",
  ],
  alternates: { canonical: "/biblequiz" },
  openGraph: {
    title: "Bible Quiz Online — Faith Companion AI",
    description:
      "Free Bible quiz with multiple categories. Test your Scripture knowledge and challenge friends.",
    url: "https://faithcompanionai.com/biblequiz",
    siteName: "Faith Companion AI",
    type: "website",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI Bible Quiz" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Quiz Online — Faith Companion AI",
    description: "Free Bible trivia with shareable results. Test your Scripture knowledge.",
    images: ["/brand/og-quiz.png"],
  },
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <QuizClient />
    </main>
  );
}
