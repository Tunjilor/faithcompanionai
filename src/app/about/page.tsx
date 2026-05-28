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
            Faith Companion AI exists to make daily Christian encouragement more accessible, more personal,
            and easier to return to.
          </p>

          <p>
            We built this platform for people who want to stay connected to their faith &mdash; even in busy,
            uncertain, or difficult moments.
          </p>

          <h2 className="text-xl font-bold text-white">Faith Companion AI helps you:</h2>
          <ul className="space-y-1 pl-4">
            {[
              "Discover Scripture that speaks to your situation",
              "Generate meaningful prayers when words are hard to find",
              "Reflect through devotionals tailored to your current season",
              "Gain insight through Bible quiz results and guided reflection",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 shrink-0 text-white/30">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p>
            Our goal is not to replace church, pastoral care, prayer, wise counsel, or personal Bible study.
            Instead, we aim to reduce friction and help you begin where you are &mdash; whether you need
            encouragement, clarity, or a place to start.
          </p>

          <p>
            We keep the experience grounded in Scripture, broadly Christian, and designed to support a wide
            range of believers in their daily walk.
          </p>

          <p>
            Faith Companion AI is not just a tool &mdash; it is meant to feel like a companion you can return
            to, day after day.
          </p>
        </div>
      </div>
    </main>
  );
}