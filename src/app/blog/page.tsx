// src/app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "./content";
import AdSenseSlot from "@/components/AdSenseSlot";

// Re-evaluate on every request so the publish-date filter uses the real current date.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Bible Study Tips, Prayer Guides & Faith Resources | Faith Companion AI",
  description:
    "Practical guides on prayer, Bible study, devotionals, and Scripture memory. Written to help you grow in faith with Scripture-grounded, actionable content.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Faith Companion AI Blog — Bible Study Tips & Prayer Guides",
    description: "Practical guides on prayer, Bible study, devotionals, and Scripture memory.",
    url: "https://faithcompanionai.com/blog",
    type: "website",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI Blog" }],
  },
};

export default function BlogPage() {
  // Only posts with publishDate <= today, sorted newest first
  const posts = getPublishedPosts();

  return (
    <>
      <header className="mb-8">
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
          Faith Companion AI Blog
        </div>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
          Bible study, prayer guides & faith resources
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
          Practical, Scripture-grounded guides to help you grow in prayer, Bible knowledge,
          devotionals, and daily faith practice.
        </p>
      </header>

      <AdSenseSlot className="mb-4" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <div className="flex items-center gap-3 text-xs text-white/40">
              <time dateTime={post.dateISO}>{post.date}</time>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>

            <h2 className="mt-3 text-lg font-bold text-white leading-snug group-hover:text-orange-300 transition">
              {post.title}
            </h2>

            <p className="mt-3 flex-1 text-sm leading-6 text-white/60">
              {post.excerpt}
            </p>

            <div className="mt-4 text-sm font-semibold text-orange-300 group-hover:text-orange-200">
              Read article →
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
