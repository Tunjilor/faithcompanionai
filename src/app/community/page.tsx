// src/app/community/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community — Faith Companion AI",
  description: "Connect with other believers, share prayer requests, and grow together in faith.",
  alternates: { canonical: "/community" },
};

const upcomingFeatures = [
  {
    title: "Prayer Wall",
    description: "Share prayer requests and lift one another up. See what the community is believing for.",
    href: "/community/prayer-wall",
    status: "Coming soon",
  },
  {
    title: "Faith Challenges",
    description: "Weekly Scripture memory and devotional challenges to keep your growth consistent.",
    href: "#",
    status: "Planned",
  },
  {
    title: "Study Groups",
    description: "Join small groups organized around books of the Bible, topics, or life seasons.",
    href: "#",
    status: "Planned",
  },
];

export default function CommunityPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
          Community
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Grow together in faith
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Community features are being built. Share prayer requests, join faith challenges, and connect with
          believers who are on the same journey.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/tools/prayer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Generate a Prayer
          </Link>
          <Link
            href="/biblequiz"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Take the Bible Quiz
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-white md:text-3xl">What's coming</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {upcomingFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6"
            >
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
                {feature.status}
              </div>

              <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{feature.description}</p>

              {feature.href !== "#" && (
                <Link
                  href={feature.href}
                  className="mt-4 inline-block text-sm font-semibold text-orange-300 hover:text-orange-200"
                >
                  Preview →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-8 md:p-10">
        <h2 className="text-xl font-bold text-white">Stay connected</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
          While community features are in development, the best way to grow is with the tools already available —
          daily verses, prayers, devotionals, and the Bible quiz.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link
            href="/tools/verse"
            className="rounded-[20px] border border-white/10 bg-black/20 p-4 text-center text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Daily Verse
          </Link>
          <Link
            href="/tools/devotional"
            className="rounded-[20px] border border-white/10 bg-black/20 p-4 text-center text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Devotional
          </Link>
          <Link
            href="/biblequiz"
            className="rounded-[20px] border border-white/10 bg-black/20 p-4 text-center text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Bible Quiz
          </Link>
        </div>
      </section>
    </main>
  );
}
