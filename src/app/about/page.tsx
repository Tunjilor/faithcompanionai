// src/app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Faith Companion AI and its mission to support daily spiritual encouragement, prayer, and growth.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <h1 className="text-3xl font-bold text-white md:text-4xl">About Faith Companion AI</h1>

        <div className="mt-6 space-y-5 text-sm leading-7 text-white/75 md:text-base">
          <p>
            Faith Companion AI is designed to make daily Christian encouragement more accessible,
            more personal, and easier to return to.
          </p>

          <p>
            The platform helps users generate Scripture-based verses, prayers, devotionals, and Bible quiz results
            in a calm, mobile-friendly experience built for real daily use.
          </p>

          <p>
            Our goal is not to replace church, pastoral care, prayer, wise counsel, or personal Bible study.
            Instead, Faith Companion AI is designed to reduce friction and help people begin where they are —
            whether they need encouragement, reflection, guidance, or a place to start.
          </p>

          <p>
            We aim to keep the experience broadly Christian, Scripture-grounded, and useful across a wide range of believers.
          </p>
        </div>
      </div>
    </main>
  );
}