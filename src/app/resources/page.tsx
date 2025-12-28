import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Faith Companion AI resources: Bible study links, Christian living, and helpful tools to support your spiritual journey.",
  alternates: { canonical: "/resources" },
};

const resourceCards = [
  {
    title: "Christian Living",
    desc: "Practical guidance for faith in everyday life.",
    href: "/resources/christian-living",
  },
  {
    title: "Favorites",
    desc: "Your saved verses, prayers, and devotionals (local to this device).",
    href: "/resources/favorites",
  },
  {
    title: "Prayer Wall",
    desc: "Encourage others and share prayer requests.",
    href: "/community/prayer-wall",
  },
];

const quickLinks = [
  { label: "Generate a Verse", href: "/tools/verse" },
  { label: "Generate a Prayer", href: "/tools/prayer" },
  { label: "Daily Devotional", href: "/tools/devotional" },
  { label: "Bible Quiz", href: "/biblequiz" },
  { label: "Pricing", href: "/pricing" },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <section className="fc-surface p-8 md:p-10">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">Resources</h1>
        <p className="mt-3 text-white/70">
          Helpful sections and tools to support your spiritual journey.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {resourceCards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="fc-surface p-6 transition hover:bg-white/10"
          >
            <div className="text-lg font-semibold text-white">{c.title}</div>
            <div className="mt-2 text-white/70">{c.desc}</div>
            <div className="mt-4 text-sm font-semibold text-white/80">
              Open →
            </div>
          </Link>
        ))}
      </section>

      <section className="fc-surface p-6 md:p-8">
        <h2 className="text-xl font-bold text-white">Quick Links</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 text-sm text-white/60">
          Tip: For the best experience, add Faith Companion AI to your phone’s home screen.
        </div>
      </section>
    </div>
  );
}
