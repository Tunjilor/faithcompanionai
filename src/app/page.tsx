// src/app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import HomeCtaLayer from "@/components/home/HomeCtaLayer";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Faith Companion AI",
  description:
    "Get Scripture-based verses, prayers, devotionals, and Bible quizzes designed to support your daily walk with God.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Faith Companion AI",
    description:
      "Scripture-based verses, prayers, devotionals, and Bible quizzes for daily encouragement and growth.",
    url: "https://faithcompanionai.com",
    siteName: "Faith Companion AI",
    type: "website",
    images: [
      {
        url: "/brand/og-quiz.png",
        width: 1200,
        height: 630,
        alt: "Faith Companion AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith Companion AI",
    description:
      "Scripture-based verses, prayers, devotionals, and Bible quizzes for daily encouragement and growth.",
    images: ["/brand/og-quiz.png"],
  },
};

const featureCards = [
  {
    title: "Verse",
    description:
      "Get a Scripture-focused verse thought with encouragement and a simple next step.",
    href: "/tools/verse",
    tag: "Quick help",
  },
  {
    title: "Prayer",
    description:
      "Generate a personal prayer for what you are facing, with a calm and faith-filled tone.",
    href: "/tools/prayer",
    tag: "Daily support",
  },
  {
    title: "Devotional",
    description:
      "Receive a devotional with reflection, prayer, Scripture references, and action steps.",
    href: "/tools/devotional",
    tag: "Go deeper",
  },
];

const reasons = [
  {
    title: "Scripture-grounded",
    description:
      "Built to encourage daily faith through Bible-based reflection, not empty inspiration.",
  },
  {
    title: "Fast and personal",
    description:
      "Start with what you need right now — peace, guidance, strength, hope, healing, or prayer.",
  },
  {
    title: "Designed for consistency",
    description:
      "Move from one-time inspiration to a repeatable rhythm of prayer, reflection, and growth.",
  },
];

const faqItems = [
  {
    q: "What is Faith Companion AI?",
    a: "Faith Companion AI is a Christian-focused app experience that helps you generate Scripture-based verses, prayers, devotionals, and Bible quiz results for daily encouragement and growth.",
  },
  {
    q: "Is this denominational?",
    a: "It is designed to be broadly Christian, Scripture-grounded, and helpful across a wide range of believers.",
  },
  {
    q: "Can I use it for free?",
    a: "Yes. Free users can explore the tools with limits. Premium unlocks unlimited usage and saved faith journal access.",
  },
  {
    q: "What should I start with first?",
    a: "Most people start with Verse for encouragement, Prayer for a current burden, or Devotional for deeper reflection.",
  },
];

export default function HomePage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Faith Companion AI",
      url: "https://faithcompanionai.com",
      description:
        "Scripture-based verses, prayers, devotionals, and Bible quizzes for daily encouragement and growth.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://faithcompanionai.com/resources",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Faith Companion AI",
      url: "https://faithcompanionai.com",
      logo: "https://faithcompanionai.com/brand/icon-192.png",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@faithcompanionai.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Faith Companion AI",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "A Christian-focused web app for verses, prayers, devotionals, and Bible quizzes.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd data={schema} />

      <section className="rounded-[32px] p-8 shadow-2xl md:p-12" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
            Daily verses • prayers • devotionals • Bible quiz
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Scripture-based support for your daily walk with God
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-lg">
            Faith Companion AI helps you find a verse, write a prayer, go deeper with a devotional,
            and build a more consistent spiritual rhythm — all in one calm, mobile-friendly experience.
          </p>

          <div className="mt-8">
            <HomeCtaLayer />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/50 sm:text-sm">
            <span>Free to try</span>
            <span>•</span>
            <span>Built for mobile and desktop</span>
            <span>•</span>
            <span>Designed for daily use</span>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {featureCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-[26px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
              {card.tag}
            </div>

            <h2 className="mt-4 text-2xl font-bold text-white">{card.title}</h2>

            <p className="mt-3 text-sm leading-7 text-white/70">
              {card.description}
            </p>

            <div className="mt-5 text-sm font-semibold text-orange-300">
              Open {card.title.toLowerCase()} →
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-10 rounded-[30px] p-8 md:p-10" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Built for the moments when you need direction, peace, or a place to begin
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
              Some days you need a quick verse. Some days you need a prayer for what you are carrying.
              Some days you want a fuller devotional to slow down and reflect. Faith Companion AI is designed
              to meet you in all three.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools/prayer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Try Prayer
              </Link>

              <Link
                href="/tools/devotional"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Try Devotional
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {reasons.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] p-5" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[28px] p-8" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-sm font-semibold text-orange-300">Quiz + Growth Loop</div>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            Test your Bible knowledge and challenge others
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
            The Bible Quiz adds a fun layer to the experience. Take a quiz, review your answers,
            and share your score so friends can try to beat it.
          </p>

          <div className="mt-6">
            <Link
              href="/biblequiz"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Take the Quiz
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] p-8" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-sm font-semibold text-orange-300">Premium</div>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            Keep your journey in one place
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
            Premium is for people who want more than occasional inspiration. It unlocks unlimited use and lets you
            save meaningful verses, prayers, and devotionals in your personal faith journal.
          </p>

          <div className="mt-6">
            <Link
              href="/pricing"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[30px] p-8 md:p-10" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            A calmer, more consistent faith experience
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
            Faith Companion AI is built to reduce friction. Instead of wondering where to begin,
            you can open the app, choose the kind of support you need, and keep moving in the right direction.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Frequently asked questions
        </h2>

        <div className="mt-6 space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.q}
              className="rounded-[22px] p-5"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-white md:text-base">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-7 text-white/70 md:text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-10 rounded-[30px] p-8 md:p-10" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            How it works
          </div>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            Three steps to daily spiritual support
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Choose your tool",
              description:
                "Select Verse for quick encouragement, Prayer for a personal need, or Devotional for deeper reflection. Bible Quiz for learning.",
            },
            {
              step: "2",
              title: "Get Scripture-based content",
              description:
                "AI generates a response grounded in the Bible — not empty inspiration, but real verses, prayers, and devotionals tied to your situation.",
            },
            {
              step: "3",
              title: "Save and grow",
              description:
                "Premium members save meaningful content to their personal faith journal. Return anytime to revisit and build a consistent spiritual rhythm.",
            },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 text-sm font-extrabold text-white">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm leading-7 text-white/65">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-10">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            What people are saying
          </div>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            Real stories from daily users
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              quote:
                "I've tried a dozen devotional apps and nothing stuck. Faith Companion AI is the first one I've used every single morning for more than a month. The prayers feel real, not templated.",
              name: "Sarah M.",
              detail: "Daily devotional user",
            },
            {
              quote:
                "The Bible Quiz is addictive in the best way. I've learned more Scripture in six weeks of playing than I did in years of occasional church attendance.",
              name: "James T.",
              detail: "Bible Quiz player",
            },
            {
              quote:
                "I was going through a really hard season and didn't know how to pray about it. I typed what I was feeling and got back a prayer that said exactly what was in my heart. I cried.",
              name: "Rachel L.",
              detail: "Prayer tool user",
            },
            {
              quote:
                "As a pastor I recommend this to my congregation for their personal devotional time. The devotionals are solid, Scripture-grounded, and never feel shallow.",
              name: "Pastor David K.",
              detail: "Community pastor",
            },
            {
              quote:
                "I'm not a strong reader but the verse thoughts are just the right length. I get a verse, an encouraging word, and one thing to do. Simple. Effective. Keeps me consistent.",
              name: "Marcus W.",
              detail: "Verse tool user",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-[24px] p-6"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p className="text-sm leading-7 text-white/75 italic">"{t.quote}"</p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-white/45">{t.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Start with the support you need today
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Choose a verse for encouragement, a prayer for your current burden, or a devotional for deeper reflection.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/tools/verse"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Verse
          </Link>
          <Link
            href="/tools/prayer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Prayer
          </Link>
          <Link
            href="/tools/devotional"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Devotional
          </Link>
        </div>
      </section>
    </main>
  );
}