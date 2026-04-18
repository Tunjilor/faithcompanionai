// src/app/resources/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Explore Christian resources for prayer, Bible study, encouragement, and spiritual growth on Faith Companion AI.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Faith Companion AI Resources",
    description:
      "Explore Christian resources for prayer, Bible study, encouragement, and spiritual growth.",
    url: "https://faithcompanionai.com/resources",
    siteName: "Faith Companion AI",
    type: "website",
    images: [
      {
        url: "/brand/og-quiz.png",
        width: 1200,
        height: 630,
        alt: "Faith Companion AI Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith Companion AI Resources",
    description:
      "Explore Christian resources for prayer, Bible study, encouragement, and spiritual growth.",
    images: ["/brand/og-quiz.png"],
  },
};

const featuredResources = [
  {
    title: "Bible Verses by Topic",
    description:
      "Find guidance for anxiety, hope, peace, healing, forgiveness, strength, and more.",
    href: "/tools/verse",
    tag: "Popular",
  },
  {
    title: "Prayer Help",
    description:
      "Generate a personal prayer for your current situation with a calm, Scripture-grounded tone.",
    href: "/tools/prayer",
    tag: "Daily Use",
  },
  {
    title: "Daily Devotional Support",
    description:
      "Get a devotional with reflection, prayer, and practical next steps for your walk with God.",
    href: "/tools/devotional",
    tag: "Growth",
  },
];

const faqs = [
  {
    q: "What kind of resources are available here?",
    a: "Faith Companion AI helps you explore Scripture-based encouragement, prayer support, devotionals, and Bible quiz learning in one place.",
  },
  {
    q: "Are these resources denominational?",
    a: "They are designed to be broadly Christian, Scripture-grounded, and welcoming for a wide range of believers.",
  },
  {
    q: "Do I need an account to use the resources?",
    a: "No. You can explore the tools for free. Creating an account and upgrading unlocks a deeper journal-based experience.",
  },
  {
    q: "What is the best place to start?",
    a: "Most people start with Verse, Prayer, or Devotional depending on what they need that day.",
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
        "Christian resources for prayer, Bible study, encouragement, and spiritual growth.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://faithcompanionai.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Resources",
          item: "https://faithcompanionai.com/resources",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
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

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
            Faith Companion AI Resources
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Christian resources for daily growth, prayer, and encouragement
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Explore tools and Scripture-based support for everyday faith. Whether you need a prayer,
            a devotional, a Bible verse by topic, or a way to stay consistent, this is your place to start.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/tools/verse"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Start with Verse
            </Link>

            <Link
              href="/pricing"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore Premium
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Featured resources
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {featuredResources.map((resource) => (
            <Link
              key={resource.title}
              href={resource.href}
              className="group rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                {resource.tag}
              </div>

              <h3 className="mt-4 text-xl font-bold text-white">
                {resource.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/70">
                {resource.description}
              </p>

              <div className="mt-5 text-sm font-semibold text-orange-300">
                Open resource →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
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
              <p className="mt-3 text-sm leading-7 text-white/70 md:text-base">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}