import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Explore Christian resources, favorites, and helpful tools to support your daily faith journey.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-white">Resources</h1>
        <p className="mt-2 text-white/70">
          Helpful pages to support your faith journey—favorites, Christian living, and more.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/resources/christian-living" className="fc-surface p-6 hover:bg-white/10 transition">
          <div className="text-lg font-bold text-white">Christian Living</div>
          <div className="mt-2 text-white/70">
            Encouragement and practical faith-based guidance for everyday life.
          </div>
        </Link>

        <Link href="/resources/favorites" className="fc-surface p-6 hover:bg-white/10 transition">
          <div className="text-lg font-bold text-white">Favorites</div>
          <div className="mt-2 text-white/70">
            Your saved verses, prayers, and devotionals stored on this device.
          </div>
        </Link>
      </div>

      <div className="fc-surface p-6 md:p-8 text-center">
        <h2 className="text-xl font-bold text-white">Want more tools and premium content?</h2>
        <p className="mt-2 text-white/70">
          Upgrade to unlock more generations, quizzes, and future features.
        </p>

        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
          >
            Go Premium
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
