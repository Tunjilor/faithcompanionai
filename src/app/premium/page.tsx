// src/app/premium/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Premium",
  description:
    "Upgrade to Faith Companion AI Premium for unlimited verses, prayers, devotionals, and your personal faith journal.",
  alternates: {
    canonical: "/premium",
  },
  openGraph: {
    title: "Faith Companion AI Premium",
    description:
      "Unlimited verses, prayers, devotionals, and saved faith journal access.",
    url: "/premium",
    siteName: "Faith Companion AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith Companion AI Premium",
    description:
      "Unlimited verses, prayers, devotionals, and saved faith journal access.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const monthlyPrice = "$4.99/month";

const features = [
  "Unlimited AI-powered verses, prayers, and devotionals",
  "Save your favorite verses to your account",
  "Build your personal faith journal over time",
  "Revisit meaningful answers anytime",
  "Stay consistent with a calmer daily faith routine",
  "Mobile-friendly experience you can use anywhere",
];

const faqs = [
  {
    q: "What do I get with Premium?",
    a: "Premium unlocks unlimited verses, prayers, and devotionals, plus the ability to save your spiritual journey inside your account.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Premium is designed to be simple and flexible, and you can cancel anytime.",
  },
  {
    q: "Is Faith Companion AI a replacement for church or pastoral care?",
    a: "No. Faith Companion AI is a personal spiritual companion for encouragement, scripture reflection, and daily consistency. It is not a replacement for church, pastoral care, counseling, or medical advice.",
  },
  {
    q: "Do I need Premium to use the app?",
    a: "No. Free users can still generate verses, prayers, and devotionals with limits. Premium is for people who want unlimited access and saved journal features.",
  },
];

export default function PremiumPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <section className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
          Faith Companion AI Premium
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Grow closer to God, one day at a time.
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
          Unlimited AI-powered verses, prayers, and devotionals — plus your own
          personal faith journal to save what matters most.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://buy.stripe.com/aFaeVf0KS0lZ3DCajZ8Vi06"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Start Premium
          </a>

          <Link
            href="/tools/verse"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Try the free version
          </Link>
        </div>

        <div className="mt-6 text-sm text-white/60">
          {monthlyPrice} • cancel anytime
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8">
          <h2 className="text-2xl font-bold text-white">
            What Premium unlocks
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/70 md:text-base">
            Premium is built for people who want more than occasional inspiration.
            It is for people who want a steady, personal rhythm of faith.
          </p>

          <div className="mt-6 grid gap-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="mt-0.5 text-emerald-400">✓</div>
                <div className="text-sm leading-6 text-white/85 md:text-base">
                  {feature}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-5">
            <h3 className="text-sm font-semibold text-amber-100 md:text-base">
              Why people upgrade
            </h3>
            <p className="mt-2 text-sm leading-6 text-amber-50/85 md:text-base">
              Free access helps you get started. Premium helps you stay consistent,
              save what resonates, and build a more personal faith routine over time.
            </p>
          </div>
        </div>

        <aside className="rounded-3xl border border-white/10 bg-white p-6 shadow-2xl md:p-8">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Premium Plan
          </div>

          <div className="mt-3 text-4xl font-bold text-slate-900">
            $4.99
            <span className="text-lg font-medium text-slate-500">/month</span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Simple pricing for unlimited spiritual guidance and saved journal access.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              Unlimited verse, prayer, and devotional generation
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              Save your faith journey to your account
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              Designed for daily use on mobile and desktop
            </div>
          </div>

          <a
            href="https://buy.stripe.com/aFaeVf0KS0lZ3DCajZ8Vi06"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex w-full min-h-[48px] items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Upgrade to Premium
          </a>

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            No spam. No distractions. Just faith-focused guidance.
          </p>
        </aside>
      </section>

      <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            This is more than a tool.
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/70 md:text-base">
            Faith Companion AI is designed to feel like a calm, consistent companion
            for your daily walk — helping you find scripture, pray with intention,
            and keep what matters close.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-white md:text-3xl">
            Frequently asked questions
          </h2>

          <div className="mt-8 space-y-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-white md:text-base">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-6 text-white/70 md:text-base">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Ready to keep going without interruptions?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Upgrade today and turn your verses, prayers, and devotionals into a personal
          faith journal you can return to anytime.
        </p>

        <div className="mt-6">
          <a
            href="https://buy.stripe.com/aFaeVf0KS0lZ3DCajZ8Vi06"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Start Premium
          </a>
        </div>
      </section>
    </main>
  );
}