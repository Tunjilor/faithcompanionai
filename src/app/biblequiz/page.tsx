// src/app/biblequiz/page.tsx

import type { Metadata } from "next";
import QuizClient from "./quiz-client";

export const metadata: Metadata = {
  title: "Bible Quiz",
  description: "Test your Scripture knowledge with Faith Companion AI.",
  alternates: { canonical: "/biblequiz" },
  openGraph: {
    title: "Faith Companion AI — Bible Quiz",
    description: "Trivia + Speed Round Bible quizzes (premium categories included).",
    url: "https://faithcompanionai.com/biblequiz",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith Companion AI — Bible Quiz",
    description: "Trivia + Speed Round Bible quizzes (premium categories included).",
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
