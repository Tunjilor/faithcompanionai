import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Pray — A Simple Guide for Christians",
  description:
    "A practical, Scripture-based guide to prayer for beginners and believers who want to go deeper. Learn how to start, what to say, and how to make prayer a daily habit.",
  alternates: { canonical: "/how-to-pray" },
  openGraph: {
    title: "How to Pray | Faith Companion AI",
    description:
      "A simple, honest guide to prayer. What to say, how to start, and how to build a habit that sticks — grounded in Scripture.",
    url: "https://faithcompanionai.com/how-to-pray",
  },
};

const STEPS = [
  {
    title: "Start with honesty, not formality",
    body: "Many people avoid prayer because they feel they do not know the right words. But prayer is not a performance — it is a conversation. God already knows what you are thinking. Starting with raw honesty is not a failure of reverence; it is an act of trust.",
    verse: "\"The Lord is near to all who call on him, to all who call on him in truth.\" — Psalm 145:18",
  },
  {
    title: "Use a simple structure to begin",
    body: "Jesus gave His disciples a model prayer in Matthew 6 — what we now call the Lord's Prayer. It is not a script to be repeated mechanically, but a pattern: acknowledge who God is, ask for His will to be done, bring your needs, seek forgiveness, and ask for protection. You can build on each of these as a starting point.",
    verse: "\"Our Father in heaven, hallowed be your name...\" — Matthew 6:9",
  },
  {
    title: "Be specific",
    body: "Vague prayers often feel hollow. \"God bless everyone\" is a good impulse, but it is also easy to tune out. Naming specific people, situations, fears, and desires makes prayer feel more real — and creates a record you can look back on to see how God has moved.",
    verse: "\"Present your requests to God.\" — Philippians 4:6",
  },
  {
    title: "Include thanksgiving",
    body: "Gratitude reorients your heart. Before asking for what you need, pause to name what God has already done. This is not a prerequisite for God to hear you — it is a discipline that shapes how you see your life. Even in hard seasons, gratitude anchors you in evidence of God's faithfulness.",
    verse: "\"Give thanks in all circumstances; for this is God's will for you in Christ Jesus.\" — 1 Thessalonians 5:18",
  },
  {
    title: "Listen as well as speak",
    body: "Prayer is a conversation, which means it involves silence. After you have spoken, wait. This does not mean you will hear an audible voice — it may come as a sense of peace, a verse that comes to mind, or simply a quieting of your anxiety. Learning to be still in God's presence is itself a form of prayer.",
    verse: "\"Be still before the Lord and wait patiently for him.\" — Psalm 37:7",
  },
  {
    title: "Make it a habit, not a crisis response",
    body: "Most of us pray most intensely when things are falling apart. There is nothing wrong with that — God welcomes it. But the goal is a relationship that exists in the ordinary moments too. Daily, short, consistent prayer builds a faith that holds under pressure precisely because it has been exercised in the calm.",
    verse: "\"Pray continually.\" — 1 Thessalonians 5:17",
  },
];

const COMMON_QUESTIONS = [
  {
    q: "Does God hear every prayer?",
    a: "Scripture consistently affirms that God hears those who seek Him. John 9:31 notes that \"God listens to the godly person who does his will.\" The posture of an open heart matters more than the perfection of your words.",
  },
  {
    q: "What if I do not feel anything when I pray?",
    a: "Feelings follow faith, not the other way around. Many of the most faithful people in Scripture prayed through seasons of felt silence — including David, who wrote many Psalms in states of confusion and apparent divine absence. Keep showing up.",
  },
  {
    q: "How long should I pray?",
    a: "There is no minimum or maximum. Five minutes of honest, focused prayer is worth more than an hour of distracted repetition. Quality of attention matters more than duration. Start with what you can sustain.",
  },
  {
    q: "Can I use written prayers?",
    a: "Yes. Written prayers — from Scripture, prayer books, or tools like Faith Companion AI — are a legitimate and historic part of Christian practice. The goal is for them to become personal, not merely recited. Use them as a starting point and make them your own.",
  },
  {
    q: "What do I do when God seems silent?",
    a: "Silence does not mean absence. Continue in prayer, in Scripture, and in community. Sometimes silence is preparation. Sometimes it is an invitation to trust what you know rather than what you feel. The Psalms give full permission to be honest with God about the experience of His silence.",
  },
];

export default function HowToPrayPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">

      <div className="text-center">
        <div className="inline-flex rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
          A practical guide
        </div>
        <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">
          How to Pray
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base md:leading-8">
          Prayer is one of the most important and most misunderstood practices in the Christian life.
          This guide is for people who want to start — or who have been praying for years but want to
          go deeper. No performance required.
        </p>
      </div>

      <section className="mt-14 space-y-6">
        <h2 className="text-2xl font-extrabold text-white">Six steps to a real prayer life</h2>
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-orange-500 text-xs font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="text-base font-bold text-white">{step.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/70">{step.body}</p>
            <blockquote className="mt-4 border-l-2 border-orange-500/50 pl-3 text-xs italic text-orange-300/80">
              {step.verse}
            </blockquote>
          </div>
        ))}
      </section>

      <section
        className="mt-14 rounded-3xl p-8 text-center"
        style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(234,88,12,0.12) 100%)", border: "1px solid rgba(139,92,246,0.3)" }}
      >
        <h2 className="text-xl font-extrabold text-white">Need a prayer for your situation right now?</h2>
        <p className="mt-3 text-sm leading-7 text-white/65">
          Sometimes you know you need to pray but do not know where to start. Tell Faith Companion AI
          what you are going through and receive a personal prayer in seconds — honest, Scripture-grounded,
          and written for your moment.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/tools/prayer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Generate a Prayer
          </Link>
          <Link
            href="/tools/devotional"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Get a Daily Devotional
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-white">Common questions about prayer</h2>
        <div className="mt-6 space-y-4">
          {COMMON_QUESTIONS.map((item) => (
            <details
              key={item.q}
              className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-white md:text-base">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-7 text-white/70">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-white">Going deeper</h2>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
          Prayer is a lifelong practice. The people who pray most effectively are not those with the most
          impressive vocabulary — they are those who have shown up consistently over years, through seasons
          of feeling and feeling nothing, through answers and through silence.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
          If you are just starting, commit to five minutes each morning for two weeks. Do not judge the
          quality of your prayers. Just show up. Faith Companion AI can help you find words when you
          cannot find your own — for today&apos;s burden, today&apos;s gratitude, and today&apos;s
          question.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tools/verse"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Find a verse for today
          </Link>
          <Link
            href="/daily-devotional"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Start a devotional practice
          </Link>
          <Link
            href="/biblequiz"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Test your Bible knowledge
          </Link>
        </div>
      </section>

    </main>
  );
}
