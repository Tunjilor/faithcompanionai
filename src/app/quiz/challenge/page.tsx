// src/app/quiz/challenge/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import ChallengeClient from "./ChallengeClient";

export const metadata: Metadata = {
  title: "Bible Quiz Challenge | Faith Companion AI",
  description:
    "Challenge a friend, compare Bible quiz scores, and invite others to test their knowledge on Faith Companion AI.",
  alternates: {
    canonical: "/quiz/challenge",
  },
  openGraph: {
    title: "Bible Quiz Challenge | Faith Companion AI",
    description:
      "Challenge a friend, compare Bible quiz scores, and invite others to test their knowledge on Faith Companion AI.",
    url: "https://faithcompanionai.com/quiz/challenge",
    siteName: "Faith Companion AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Quiz Challenge | Faith Companion AI",
    description:
      "Challenge a friend, compare Bible quiz scores, and invite others to test their knowledge on Faith Companion AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ChallengePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-6 text-white backdrop-blur md:p-10">
            Loading challenge...
          </div>
        </main>
      }
    >
      <ChallengeClient />
    </Suspense>
  );
}