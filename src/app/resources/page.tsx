import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Recommended Christian resources for studying Scripture, building prayer habits, and growing daily faith.",
  alternates: { canonical: "/resources" },
};

const cards = [
  {
    title: "Study Bibles",
    desc: "Trusted study tools to go deeper in Scripture.",
    href: "/resources/christian-living",
  },
  {
    title: "Prayer Journals",
    desc: "Build a consistent prayer habit and track answered prayers.",
    href: "/tools/prayer-journal",
  },
  {
    title: "Devotional Books",
    desc: "Daily devotionals to strengthen your walk with God.",
    href: "/tools/devotional",
  },
  {
    title: "Christian Living",
    desc: "Practical guidance for everyday faith and character.",
    href: "/resources/christian-living",
  },
];

export default function ResourcesPage() {
  return (
    <main className="space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Resources
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Recommended Christian resources to support your spiritual growth—simple, trusted, and easy to explore.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="fc-surface p-6 hover:bg-white/10 transition"
          >
            <div className="text-lg font-bold text-white">{c.title}</div>
            <p className="mt-2 text-white/70">{c.desc}</p>
            <div className="mt-4 text-sm text-white/70 underline underline-offset-4">
              Explore →
            </div>
          </Link>
        ))}
      </section>

      <section className="fc-surface p-6 md:p-8">
        <h2 className="text-xl font-bold text-white">Quick Links</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-md bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15" href="/tools/verse">
            Verse
          </Link>
          <Link className="rounded-md bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15" href="/tools/prayer">
            Prayer
          </Link>
          <Link className="rounded-md bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15" href="/tools/devotional">
            Devotional
          </Link>
          <Link className="rounded-md bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15" href="/biblequiz">
            Bible Quiz
          </Link>
          <Link className="rounded-md bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15" href="/community/prayer-wall">
            Prayer Wall
          </Link>
        </div>
      </section>
    </main>
  );
}
