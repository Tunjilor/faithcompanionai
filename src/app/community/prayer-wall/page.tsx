// src/app/community/prayer-wall/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prayer Wall — Faith Companion AI",
  description: "Share prayer requests and lift one another up. Community prayer features coming soon.",
  alternates: { canonical: "/community/prayer-wall" },
};

export default function PrayerWallPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
          Prayer Wall
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Lift one another up in prayer
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          The Prayer Wall is coming — a place to share what you're believing for, read requests from others, and
          pray together as a community of faith.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/tools/prayer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Generate a Personal Prayer
          </Link>
          <Link
            href="/community"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to Community
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-8 md:p-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl">
            🙏
          </div>
          <h2 className="text-xl font-bold text-white">Community prayer is on the way</h2>
        </div>

        <p className="mt-4 text-sm leading-7 text-white/70">
          When the Prayer Wall launches, you'll be able to:
        </p>

        <ul className="mt-4 space-y-3 text-sm text-white/70">
          <li className="flex gap-3">
            <span className="text-orange-400">→</span>
            <span>Post a prayer request for the community to see and pray over</span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-400">→</span>
            <span>Mark requests as prayed for and leave encouragement</span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-400">→</span>
            <span>See answered prayers and give thanks publicly</span>
          </li>
          <li className="flex gap-3">
            <span className="text-orange-400">→</span>
            <span>Pray anonymously or with your display name</span>
          </li>
        </ul>

        <div className="mt-8 rounded-[20px] border border-white/10 bg-black/20 p-5">
          <p className="text-sm font-semibold text-white">In the meantime</p>
          <p className="mt-2 text-sm leading-6 text-white/65">
            Use the Prayer tool to generate a personal Scripture-grounded prayer for anything you're facing right now.
          </p>
          <Link
            href="/tools/prayer"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Open Prayer Tool
          </Link>
        </div>
      </section>
    </main>
  );
}
