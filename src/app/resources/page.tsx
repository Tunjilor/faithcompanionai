// src/app/resources/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Christian Resources — Bible Study, Prayer & Devotional Tools | Faith Companion AI",
  description:
    "Free Christian resources for daily Bible study, AI-powered prayer, devotionals, and Scripture memory. Explore Bible quiz, verse finder, and faith tools designed for daily spiritual growth.",
  keywords: [
    "Christian resources",
    "Bible study tools",
    "AI prayer generator",
    "Christian devotional app",
    "Scripture memory",
    "daily Bible verse",
    "Bible quiz online",
    "faith tools online",
    "free Christian app",
  ],
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Christian Resources — Faith Companion AI",
    description:
      "Free tools for daily Bible study, prayer, devotionals, and spiritual growth. AI-powered and Scripture-grounded.",
    url: "https://faithcompanionai.com/resources",
    siteName: "Faith Companion AI",
    type: "website",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Faith Companion AI Resources" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Resources — Faith Companion AI",
    description: "Free tools for daily Bible study, prayer, devotionals, and spiritual growth.",
    images: ["/brand/og-quiz.png"],
  },
};

const startHere = [
  {
    label: "Verse",
    tag: "Most used",
    description:
      "Get a Scripture-based verse for any topic — peace, anxiety, hope, healing, strength, grief, or guidance. Includes references and a simple next step.",
    href: "/tools/verse",
    cta: "Get a verse →",
  },
  {
    label: "Prayer",
    tag: "Daily use",
    description:
      "Generate a personal prayer for what you're facing right now. Calm, Scripture-grounded, and suited for any situation or tone.",
    href: "/tools/prayer",
    cta: "Write a prayer →",
  },
  {
    label: "Devotional",
    tag: "Go deeper",
    description:
      "Get a full devotional with Scripture, reflection, prayer, and two action steps. Great for morning routines and group study.",
    href: "/tools/devotional",
    cta: "Read a devotional →",
  },
];

const goDeeper = [
  {
    label: "Bible Quiz",
    tag: "Free",
    description:
      "Test your Scripture knowledge across six categories — General Bible, Women of the Bible, Parables, Theology, Church History, and AI Bible Questions. Share your score and challenge friends.",
    href: "/biblequiz",
    cta: "Take the quiz →",
  },
  {
    label: "Verse Finder",
    tag: "Search",
    description:
      "Search the Bible by topic or keyword and find the passages most relevant to what you're studying or facing.",
    href: "/tools/verse-finder",
    cta: "Search Scripture →",
  },
  {
    label: "Scripture Memory",
    tag: "Practice",
    description:
      "Build a consistent habit of memorizing key Bible verses. Great for staying grounded in Scripture across the week.",
    href: "/tools/scripture-memory",
    cta: "Start memorizing →",
  },
];

const faqs = [
  {
    q: "Are these resources free?",
    a: "Yes. The core tools — Verse, Prayer, and Devotional — are free to try with daily limits. Premium removes those limits and lets you save content to your personal faith journal.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is required to try any of the tools. Creating a free account gives you more daily uses. Upgrading to Premium gives you unlimited access and lets you save everything.",
  },
  {
    q: "Is this denominational?",
    a: "No. These tools are designed to be broadly Christian, Scripture-grounded, and welcoming for believers across a wide range of traditions.",
  },
  {
    q: "What is the best way to start?",
    a: "Most people start with Verse for quick encouragement, Prayer when they need help articulating something, or Devotional for a fuller daily practice. The Bible Quiz is great for learning Scripture in a fun way.",
  },
  {
    q: "What does Premium unlock?",
    a: "Premium removes all daily limits, lets you save verses, prayers, and devotionals to your personal faith journal, and unlocks premium Bible quiz categories including Theology and Church History.",
  },
  {
    q: "Can I use this on my phone?",
    a: "Yes. Faith Companion AI is mobile-first and works on any device — no app download required.",
  },
];

export default function ResourcesPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Faith Companion AI Resources",
      url: "https://faithcompanionai.com/resources",
      description:
        "Free Christian resources for daily Bible study, prayer, devotionals, and spiritual growth.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://faithcompanionai.com/" },
        { "@type": "ListItem", position: 2, name: "Resources", item: "https://faithcompanionai.com/resources" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd data={schema} />

      {/* ── Hero ── */}
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
            Faith Companion AI Resources
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Everything you need for your daily walk with God
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Scripture-grounded tools for verses, prayer, devotionals, Bible study, and community — all in one place.
            Free to start. No app download required.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/tools/verse"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Start with Verse
            </Link>
            <Link
              href="/biblequiz"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Take the Bible Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* ── Start Here Today ── */}
      <section className="mt-12">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-400">
          Start here today
        </div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Verse, Prayer, and Devotional
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
          The three core tools. Use one or all three — each takes under a minute and is grounded in Scripture.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {startHere.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex flex-col rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-white">{item.label}</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                  {item.tag}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-7 text-white/65">{item.description}</p>
              <div className="mt-5 text-sm font-semibold text-orange-300 group-hover:text-orange-200">
                {item.cta}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Go Deeper ── */}
      <section className="mt-12">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-400">
          Go deeper
        </div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Bible Quiz, Verse Finder & Scripture Memory
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
          Build Bible knowledge, explore the text, and develop a habit of Scripture in your daily life.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {goDeeper.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex flex-col rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-white">{item.label}</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                  {item.tag}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-7 text-white/65">{item.description}</p>
              <div className="mt-5 text-sm font-semibold text-orange-300 group-hover:text-orange-200">
                {item.cta}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Community ── */}
      <section className="mt-12 rounded-[28px] border border-white/10 bg-white/5 p-8 md:p-10">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-400">
          Community
        </div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Pray together
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
          Community features are coming. The Prayer Wall will let you share requests, read what others are
          believing for, and lift one another up. For now, use the Prayer tool for personal support.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/community/prayer-wall"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View Prayer Wall
          </Link>
          <Link
            href="/tools/prayer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Generate a Prayer
          </Link>
        </div>
      </section>

      {/* ── Premium upsell ── */}
      <section className="mt-12 rounded-[28px] bg-gradient-to-r from-violet-700/70 via-fuchsia-700/60 to-orange-600/70 p-8 md:p-10">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
          Premium
        </div>
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Remove limits and save your journey
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
          Premium removes all daily limits, lets you save your favourite verses, prayers, and devotionals, and
          unlocks premium Bible quiz categories including Theology and Church History. Starting at $4.99/month.
        </p>

        <ul className="mt-5 grid gap-2 text-sm text-white/85 sm:grid-cols-2">
          {[
            "Unlimited verses, prayers & devotionals",
            "Save content to your personal faith journal",
            "Premium quiz categories (Theology, History)",
            "AI-generated explanations on quiz results",
            "Use on mobile or desktop — no app needed",
            "Cancel anytime on monthly plan",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-0.5 text-orange-300">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            See Pricing
          </Link>
          <Link
            href="/tools/verse"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Try Free First
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Frequently asked questions
        </h2>

        <div className="mt-6 space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="rounded-[20px] border border-white/10 bg-white/5 p-5"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-white md:text-base">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-7 text-white/70 md:text-base">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
