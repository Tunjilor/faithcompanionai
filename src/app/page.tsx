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
      "Personalized scripture delivered for exactly what you are going through — not a random verse, but the right one.",
    href: "/tools/verse",
    tag: "Personalized scripture",
  },
  {
    title: "Prayer",
    description:
      "AI prayers that speak to your situation. Type what is on your heart and receive a prayer that feels like it was written for you.",
    href: "/tools/prayer",
    tag: "AI prayers",
  },
  {
    title: "Devotional",
    description:
      "Deeper guidance, reflection, and faith insights tailored to your moment — not a generic daily reading.",
    href: "/tools/devotional",
    tag: "Guidance + insights",
  },
];

const reasons = [
  {
    title: "Find peace in anxiety",
    description:
      "When worry feels overwhelming, receive the exact scripture and prayer that speaks directly to what you are carrying right now.",
  },
  {
    title: "Hear God's word for your situation",
    description:
      "Most apps give the same verses. This one learns your situation and delivers exactly what you need in that moment.",
  },
  {
    title: "Stay consistent in faith",
    description:
      "Move from one-time inspiration to a repeatable rhythm of prayer, reflection, and growth that fits your life.",
  },
];

const TESTIMONIALS = [
  {
    quote: "This helped me stay consistent in my faith when I was struggling. I open it every morning before anything else.",
    name: "Sarah M.",
    detail: "Daily devotional user",
  },
  {
    quote: "It feels like the verses speak directly to my situation. I typed what I was going through and it gave me exactly what I needed to hear.",
    name: "Rachel L.",
    detail: "Prayer tool user",
  },
  {
    quote: "I have tried a lot of Bible apps. This is the first one that actually feels personal. The prayers do not sound templated -- they sound like they were written for me.",
    name: "Marcus W.",
    detail: "Verse and prayer user",
  },
  {
    quote: "As a pastor I recommend this to my congregation for personal devotional time. Solid, Scripture-grounded, never shallow.",
    name: "Pastor David K.",
    detail: "Community pastor",
  },
  {
    quote: "The Bible Quiz is addictive in the best way. I have learned more Scripture in six weeks than in years of occasional church attendance.",
    name: "James T.",
    detail: "Bible Quiz player",
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
          <div className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white/70" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}>
            Daily verses • prayers • devotionals • Bible quiz
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Stop Searching for the Right Verse. Let It Find You.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-lg">
            Faith Companion uses AI to understand what you are going through — and delivers the exact
            scripture, prayer, and guidance you need in that moment.
          </p>

          <div className="mt-8">
            <HomeCtaLayer />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/50 sm:text-sm">
            <span>Free to try</span>
            <span>•</span>
            <span>Personalized to your situation</span>
            <span>•</span>
            <span>Scripture-grounded, not generic</span>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {featureCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-[26px] p-6 transition"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
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
              Feeling overwhelmed, lost, or disconnected?
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
              Most apps give you the same verses everyone else gets. Faith Companion AI understands
              your situation and gives you exactly what you need — the right scripture, a personal prayer,
              and real guidance for where you are right now.
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
          <div className="text-sm font-semibold text-orange-300">Discover Your Faith Journey</div>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            Discover What Your Faith Journey Needs Right Now
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
            Take a quick quiz to uncover where you are spiritually and get a personalized starting point
            for your faith journey. Takes less than 2 minutes.
          </p>

          <div className="mt-6">
            <Link
              href="/biblequiz"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Take the Quiz Now
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
            An adaptive faith experience that learns what you need
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
            Most devotional apps give the same content to everyone. Faith Companion AI is different —
            it understands your situation and delivers a personalized scripture, prayer, and guidance
            tailored to exactly where you are in your walk with God.
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
            Three steps to personalized spiritual support
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Tell us what you are going through",
              description:
                "Share your situation — anxiety, grief, confusion, gratitude, a specific burden. No judgment, just honesty.",
            },
            {
              step: "2",
              title: "AI understands your situation",
              description:
                "Faith Companion reads the context of what you share and finds the scripture, prayer, and guidance most relevant to you.",
            },
            {
              step: "3",
              title: "Get personalized scripture and guidance",
              description:
                "Receive a verse, prayer, or devotional that speaks directly to your moment — not a generic response, but one made for you.",
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

      {/* Product preview */}
      <section className="mt-10">
        <div className="text-center mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-orange-400">See it in action</div>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">Scripture and guidance, personalized to you</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* AI Verse preview */}
          <div className="rounded-[24px] p-5 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Verse</div>
            <div className="text-xs text-white/50">Topic: Anxiety and peace</div>
            <blockquote className="text-sm leading-7 text-white/85 italic border-l-2 border-purple-500 pl-3">
              &ldquo;Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.&rdquo;
            </blockquote>
            <div className="text-xs text-orange-300 font-semibold">Philippians 4:6</div>
            <p className="text-xs leading-6 text-white/60">
              Whatever is weighing on you today, God invites you to bring it to Him -- not after you have it figured out, but right now, as you are.
            </p>
          </div>

          {/* AI Prayer preview */}
          <div className="rounded-[24px] p-5 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Prayer</div>
            <div className="text-xs text-white/50">Situation: Feeling lost and unsure</div>
            <p className="text-sm leading-7 text-white/85 italic">
              &ldquo;Father, I come to You in a moment of uncertainty. I do not know which direction to take, but I trust that You do. Guide my steps, calm my mind, and remind me that I am not walking this road alone...&rdquo;
            </p>
            <div className="text-xs text-white/45 mt-auto">Generated for your situation</div>
          </div>

          {/* Devotional preview */}
          <div className="rounded-[24px] p-5 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Devotional</div>
            <div className="text-xs text-white/50">Topic: Trusting God in hard seasons</div>
            <div className="text-sm font-bold text-white">When the Path Is Hidden</div>
            <p className="text-xs leading-6 text-white/70">
              Proverbs 3:5-6 calls us to trust in the Lord with all our heart and lean not on our own understanding. In the hardest seasons, this is less a comfort and more a choice -- a daily decision to release what we cannot control...
            </p>
            <div className="text-xs text-orange-300 font-semibold">+ Reflection &bull; Prayer &bull; Action steps</div>
          </div>
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
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-[24px] p-6"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <p className="text-sm leading-7 text-white/75 italic">&ldquo;{t.quote}&rdquo;</p>
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
          Start Your Faith Journey Today
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Tell us what you are going through and receive the exact scripture, prayer, and guidance you need right now.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/biblequiz"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Start Your Faith Journey
          </Link>
        </div>
      </section>
    </main>
  );
}