import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daily Devotional for Today",
  description:
    "Start your day with a personalized Christian devotional. Scripture-based reflection, a short prayer, and one action step — tailored to where you are right now.",
  alternates: { canonical: "/daily-devotional" },
  openGraph: {
    title: "Daily Devotional for Today | Faith Companion AI",
    description:
      "Personalized daily devotionals grounded in Scripture. Reflection, prayer, and action steps for your faith journey.",
    url: "https://faithcompanionai.com/daily-devotional",
  },
};

const WHAT_TO_EXPECT = [
  {
    heading: "A Scripture passage",
    body: "Each devotional is anchored in a specific Bible verse — not chosen randomly, but matched to what you are walking through.",
  },
  {
    heading: "A personal reflection",
    body: "A short meditation on what that passage means for your life today. Not generic commentary — something that speaks to your moment.",
  },
  {
    heading: "A short prayer",
    body: "A prayer you can make your own. Written in plain language, honest in tone, and grounded in faith.",
  },
  {
    heading: "One action step",
    body: "Faith without action is incomplete. Every devotional ends with a practical step you can take today.",
  },
];

const WHY_DAILY = [
  "Consistency builds faith more than intensity. A few minutes every day matters more than one hour once a month.",
  "Starting your morning in Scripture shapes how you see everything that follows — your conversations, decisions, and reactions.",
  "God speaks through His Word. A daily devotional creates space to hear what He might be saying specifically to you.",
  "A habit of reflection helps you process life through a faith lens rather than just a survival lens.",
];

export default function DailyDevotionalPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">

      <div className="text-center">
        <div className="inline-flex rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
          Daily practice
        </div>
        <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">
          Daily Devotional for Today
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base md:leading-8">
          A few minutes in Scripture every morning can change the trajectory of your entire day.
          Faith Companion AI generates a personalized devotional — based on what you are going through
          right now, not a one-size-fits-all reading for the masses.
        </p>
        <div className="mt-8">
          <Link
            href="/tools/devotional"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Get Today&apos;s Devotional
          </Link>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-white">What is a daily devotional?</h2>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base md:leading-8">
          A devotional is a short spiritual practice — typically 5 to 15 minutes — that combines Scripture
          reading, personal reflection, and prayer. The goal is not to become a Bible scholar overnight.
          The goal is to show up consistently, stay connected to God, and let His Word speak into your
          actual life.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base md:leading-8">
          Traditional devotionals are written for everyone, which often means they speak to no one in particular.
          Faith Companion AI changes that — enter your topic, your season, or what you are carrying today,
          and receive a devotional that was built for you.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-white">What your devotional includes</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {WHAT_TO_EXPECT.map((item) => (
            <div
              key={item.heading}
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <h3 className="font-semibold text-white">{item.heading}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-white">Why do a devotional every day?</h2>
        <ul className="mt-6 space-y-4">
          {WHY_DAILY.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-orange-500 text-xs font-extrabold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-7 text-white/75">{point}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-white">How to get started</h2>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
          You do not need an account to try it. Open the devotional tool, type a topic or describe what
          you are going through, and receive a full devotional in seconds. Free users can generate several
          devotionals each day. Premium members get unlimited access and can save their devotionals to a
          personal faith journal.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
          Topics that work well: anxiety, loneliness, grief, gratitude, purpose, relationships, forgiveness,
          doubt, healing, or simply &ldquo;I need direction today.&rdquo; There is no wrong starting point.
        </p>
      </section>

      <section
        className="mt-14 rounded-3xl p-8 text-center"
        style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(234,88,12,0.12) 100%)", border: "1px solid rgba(139,92,246,0.3)" }}
      >
        <h2 className="text-2xl font-extrabold text-white">Start your devotional practice today</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/65">
          Five minutes in Scripture. A prayer for your situation. One step forward. That is how faith grows.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/tools/devotional"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Generate My Devotional
          </Link>
          <Link
            href="/tools/verse"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Find a Verse Instead
          </Link>
        </div>
      </section>

    </main>
  );
}
