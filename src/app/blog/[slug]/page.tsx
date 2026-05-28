// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getPublishedPosts, isPublished } from "../content";

// Dynamic so the publishDate check runs at request time, not build time.
export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  // Only pre-render posts that are already published.
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post || !isPublished(post)) return { title: "Post not found" };

  return {
    title: `${post.title} | Faith Companion AI Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://faithcompanionai.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.dateISO,
      authors: ["Faith Companion AI"],
      images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/brand/og-quiz.png"],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  // 404 if post doesn't exist or publishDate is in the future
  if (!post || !isPublished(post)) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.dateISO,
    author: { "@type": "Organization", name: "Faith Companion AI" },
    publisher: {
      "@type": "Organization",
      name: "Faith Companion AI",
      url: "https://faithcompanionai.com",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://faithcompanionai.com/blog/${post.slug}` },
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-white">Blog</Link>
        <span>›</span>
        <span className="text-white/60 line-clamp-1">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-8 max-w-3xl">
        <div className="flex items-center gap-3 text-xs text-white/40">
          <time dateTime={post.dateISO}>{post.date}</time>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white md:text-4xl">
          {post.title}
        </h1>

        <p className="mt-4 text-base leading-7 text-white/65">{post.excerpt}</p>
      </header>

      {/* Body */}
      <div className="max-w-3xl">
        {post.body}
      </div>

      {/* Footer nav */}
      <div className="mt-12 border-t border-white/10 pt-8">
        <Link href="/blog" className="text-sm font-semibold text-orange-300 hover:text-orange-200">
          ← Back to all articles
        </Link>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {getPublishedPosts().filter((p) => p.slug !== post.slug).slice(0, 2).map((related) => (
            <Link
              key={related.slug}
              href={`/blog/${related.slug}`}
              className="rounded-[20px] border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <div className="text-xs text-white/40">{related.readTime}</div>
              <div className="mt-2 text-sm font-semibold text-white leading-snug">{related.title}</div>
              <div className="mt-2 text-xs text-orange-300">Read →</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
