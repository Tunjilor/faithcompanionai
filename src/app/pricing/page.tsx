// src/app/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Pricing — Faith Companion AI Premium | Unlimited Bible Study from $4.99/month",
  description:
    "Upgrade to Faith Companion AI Premium for unlimited Bible verses, prayers, and devotionals. Save your faith journey, unlock all quiz categories. Monthly from $4.99, lifetime available.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Faith Companion AI Pricing",
    description:
      "Unlimited verses, prayers, devotionals, and saved faith journal access.",
    url: "https://faithcompanionai.com/pricing",
    siteName: "Faith Companion AI",
    type: "website",
    images: [
      {
        url: "/brand/og-quiz.png",
        width: 1200,
        height: 630,
        alt: "Faith Companion AI Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith Companion AI Pricing",
    description:
      "Unlimited verses, prayers, devotionals, and saved faith journal access.",
    images: ["/brand/og-quiz.png"],
  },
};

const premiumFeatures = [
  "Unlimited verses, prayers, and devotionals",
  "Save your spiritual journey to your account",
  "Build your personal faith journal over time",
  "Return anytime to revisit meaningful moments",
  "Use it daily on mobile or desktop",
];

const faqs = [
  {
    q: "What does Premium unlock?",
    a: "Premium unlocks unlimited generation across the app, saved journal access, and a smoother daily faith experience without interruptions.",
  },
  {
    q: "Which plan should I choose?",
    a: "Most people should start with Monthly. It has the lowest friction and lets you experience the full product right away.",
  },
  {
    q: "Can I cancel Monthly?",
    a: "Yes. Monthly is designed to be flexible and easy to start with.",
  },
  {
    q: "Why would someone choose Yearly or Lifetime?",
    a: "Yearly is better value for committed users. Lifetime is best for early supporters who want one payment and long-term access.",
  },
];

export default function PricingPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Faith Companion AI Premium",
      description:
        "Unlimited verses, prayers, devotionals, and saved faith journal access.",
      brand: {
        "@type": "Brand",
        name: "Faith Companion AI",
      },
      offers: [
        {
          "@type": "Offer",
          url: "https://faithcompanionai.com/pricing",
          priceCurrency: "USD",
          price: "4.99",
          availability: "https://schema.org/InStock",
          category: "Subscription",
          name: "Monthly",
        },
        {
          "@type": "Offer",
          url: "https://faithcompanionai.com/pricing",
          priceCurrency: "USD",
          price: "39.99",
          availability: "https://schema.org/InStock",
          category: "Subscription",
          name: "Yearly",
        },
        {
          "@type": "Offer",
          url: "https://faithcompanionai.com/pricing",
          priceCurrency: "USD",
          price: "79.99",
          availability: "https://schema.org/InStock",
          category: "OneTimePurchase",
          name: "Lifetime",
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
    <>
      <JsonLd data={schema} />

      <section className="rounded-[28px] border border-white/10 bg-gradient-to-r from-violet-700/80 via-fuchsia-700/70 to-orange-600/80 p-8 text-center shadow-2xl">
        <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
          Faith Companion AI Premium
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
          Go deeper without interruptions
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/85 md:text-lg">
          Get unlimited verses, prayers, and devotionals — and save what matters most in your personal faith journal.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://buy.stripe.com/aFaeVf0KS0lZ3DCajZ8Vi06"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Start Premium Monthly
          </a>

          <Link
            href="/tools/verse"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Try the free version
          </Link>
        </div>

        <p className="mt-3 text-xs text-white/70">
          Secure checkout powered by Stripe
        </p>
      </section>

      {/* Free vs Premium comparison */}
      <section className="mt-6 rounded-[28px] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-widest">
          <div className="col-span-1 px-5 py-3 text-white/50" style={{ background: 'rgba(255,255,255,0.05)' }}>Feature</div>
          <div className="px-5 py-3 text-center text-white/60" style={{ background: 'rgba(255,255,255,0.05)' }}>Free</div>
          <div className="px-5 py-3 text-center text-orange-300" style={{ background: 'rgba(139,92,246,0.15)' }}>Premium</div>
        </div>

        {[
          { label: "Personalized scripture", free: "Limited daily", premium: "Unlimited" },
          { label: "AI-generated prayers", free: "Limited daily", premium: "Unlimited" },
          { label: "Devotionals", free: "Limited daily", premium: "Unlimited" },
          { label: "Bible Quiz", free: true, premium: true },
          { label: "Deeper faith guidance", free: false, premium: true },
          { label: "Save to faith journal", free: false, premium: true },
          { label: "All quiz categories", free: false, premium: true },
          { label: "Ongoing spiritual support", free: false, premium: true },
        ].map((row, i) => (
          <div
            key={row.label}
            className="grid grid-cols-3 text-sm border-t border-white/8"
            style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}
          >
            <div className="px-5 py-3 text-white/80">{row.label}</div>
            <div className="px-5 py-3 text-center text-white/55">
              {row.free === true ? <span className="text-green-400">&#10003;</span>
                : row.free === false ? <span className="text-white/25">&#8212;</span>
                : <span className="text-white/55">{row.free}</span>}
            </div>
            <div className="px-5 py-3 text-center font-medium" style={{ background: 'rgba(139,92,246,0.08)' }}>
              {row.premium === true ? <span className="text-green-400">&#10003;</span>
                : <span className="text-white/90">{row.premium}</span>}
            </div>
          </div>
        ))}

        <div className="grid grid-cols-3 border-t border-white/10 py-4" style={{ background: 'rgba(139,92,246,0.1)' }}>
          <div className="px-5 text-xs text-white/40 self-center">Start whenever you are ready</div>
          <div className="px-5 text-center">
            <Link href="/biblequiz" className="text-xs text-white/55 hover:text-white/80 transition underline underline-offset-2">
              Start Your Free Journey
            </Link>
          </div>
          <div className="px-5 text-center">
            <a
              href="https://buy.stripe.com/aFaeVf0KS0lZ3DCajZ8Vi06"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-orange-500 px-4 py-1.5 text-xs font-semibold text-white hover:opacity-95 transition"
            >
              Unlock Your Full Faith Journey
            </a>
          </div>
        </div>
      </section>

      <p className="mt-6 text-center text-sm text-white/60">
        Choose how deeply you want to grow in your faith.
      </p>

      <section className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Monthly — most popular */}
        <div className="rounded-[28px] p-6 shadow-2xl" style={{ background: 'rgba(139, 92, 246, 0.25)', border: '1px solid rgba(139, 92, 246, 0.5)' }}>
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-orange-300">Best place to start</div>
            <div className="rounded-full bg-orange-400/20 px-3 py-1 text-xs font-bold text-orange-200">
              Most Popular
            </div>
          </div>

          <div className="mt-4 text-5xl font-bold text-white">$4.99</div>
          <div className="mt-1 text-sm text-white">per month</div>

          <div className="mt-6 space-y-3">
            {premiumFeatures.map((feature) => (
              <div key={feature} className="text-sm text-white">
                • {feature}
              </div>
            ))}
          </div>

          <a
            href="https://buy.stripe.com/aFaeVf0KS0lZ3DCajZ8Vi06"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Go Monthly
          </a>

          <p className="mt-2 text-center text-xs text-white/70">
            Auto-renews • Cancel anytime
          </p>
        </div>

        {/* Yearly */}
        <div className="rounded-[28px] p-6 shadow-xl" style={{ background: 'rgba(249, 115, 22, 0.25)', border: '1px solid rgba(249, 115, 22, 0.5)' }}>
          <div className="text-sm font-semibold text-violet-300">Yearly</div>
          <div className="mt-4 text-5xl font-bold text-white">$39.99</div>
          <div className="mt-1 text-sm text-white">per year</div>

          <div className="mt-6 space-y-3 text-sm text-white">
            <p>• Better value for consistent users</p>
            <p>• Full Premium access included</p>
            <p>• ~$3.33/month billed yearly</p>
          </div>

          <a
            href="https://buy.stripe.com/7sYdRb9ho8Sv7TSbo38Vi05"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Go Yearly
          </a>

          <p className="mt-2 text-center text-xs text-white/70">
            Auto-renews • Cancel anytime
          </p>
        </div>

        {/* Lifetime */}
        <div className="rounded-[28px] p-6 shadow-xl" style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid rgba(16, 185, 129, 0.5)' }}>
          <div className="text-sm font-semibold text-white">Lifetime</div>
          <div className="mt-4 text-5xl font-bold text-white">$79.99</div>
          <div className="mt-1 text-sm text-white">one-time payment</div>

          <div className="mt-6 space-y-3 text-sm text-white">
            <p>• Best for early supporters</p>
            <p>• One payment, no renewal</p>
            <p>• Full Premium access included</p>
          </div>

          <a
            href="https://buy.stripe.com/3cI28tals8Sv2zybo38Vi04"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-orange-400 bg-orange-500/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500/30"
          >
            Get Lifetime
          </a>
        </div>
      </section>

      <section className="mt-6">
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
    </>
  );
}