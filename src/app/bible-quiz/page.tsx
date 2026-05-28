import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bible Quiz – Discover Your Faith Strength",
  description:
    "Take a free Bible quiz and discover where you stand in your faith journey. Test your Scripture knowledge, get a personalized result, and find out what to do next.",
  alternates: { canonical: "/bible-quiz" },
  openGraph: {
    title: "Bible Quiz – Discover Your Faith Strength | Faith Companion AI",
    description:
      "Take a free Bible quiz and discover where you stand in your faith journey. Personalized results included.",
    url: "https://faithcompanionai.com/bible-quiz",
    siteName: "Faith Companion AI",
    type: "website",
    images: [{ url: "/brand/og-quiz.png", width: 1200, height: 630, alt: "Bible Quiz" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Quiz – Discover Your Faith Strength | Faith Companion AI",
    description: "Take a free Bible quiz and discover where you stand in your faith journey.",
    images: ["/brand/og-quiz.png"],
  },
};

const reveals = [
  {
    heading: "Where you are in your faith journey",
    body: "Your result places you in one of four tiers — from Earnest Beginner to Bible Scholar — based on your actual answers, not a self-assessment. It is an honest, encouraging snapshot of where you are right now.",
  },
  {
    heading: "Which areas of Scripture you know well",
    body: "The quiz covers General Knowledge, Women of the Bible, the Parables of Jesus, Theology, and Church History. Your score shows where your knowledge is strong and where there is room to grow.",
  },
  {
    heading: "What to do next in your walk with God",
    body: "Every result comes with a personalized explanation, an encouraging message, and three practical next steps tailored to your tier. You leave with more than a score — you leave with direction.",
  },
];

export default function BibleQuizPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14 space-y-10">

      {/* Hero */}
      <section className="rounded-[32px] p-8 text-center md:p-12" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white/70" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
          Free &bull; No account required &bull; 10 questions
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-5xl">
          Take a Bible Quiz and Discover Your Faith Journey
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 md:text-base">
          This is not just a trivia test. It is a short, Scripture-based quiz that reveals where you
          stand in your faith, what you know, and what to focus on next. Your result is personalized
          to you.
        </p>

        <div className="mt-8">
          <Link
            href="/biblequiz"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Take the Quiz Now
          </Link>
        </div>

        <p className="mt-3 text-xs text-white/40">Takes less than 2 minutes</p>
      </section>

      {/* What it reveals */}
      <section>
        <h2 className="text-2xl font-bold text-white md:text-3xl">What the quiz reveals</h2>
        <p className="mt-3 text-sm leading-7 text-white/65 md:text-base">
          Most Bible quizzes just give you a score. This one gives you a result that means something.
        </p>

        <div className="mt-6 space-y-4">
          {reveals.map((item, i) => (
            <div
              key={i}
              className="rounded-[24px] p-6"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <h3 className="text-base font-bold text-white">{item.heading}</h3>
              <p className="mt-2 text-sm leading-7 text-white/65">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section>
        <h2 className="text-2xl font-bold text-white md:text-3xl">The four faith tiers</h2>
        <p className="mt-3 text-sm leading-7 text-white/65 md:text-base">
          Every result falls into one of four tiers. Each comes with a meaning, an encouraging message,
          and actionable next steps.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { tier: "Earnest Beginner", range: "0–49%", desc: "You are at the start of something real. Every scholar began here." },
            { tier: "Faithful Seeker", range: "50–69%", desc: "You are engaged and growing. The gaps are just the next things to discover." },
            { tier: "Growing Believer", range: "70–89%", desc: "You have a solid foundation and genuine momentum in your walk with God." },
            { tier: "Bible Scholar", range: "90–100%", desc: "Deep, consistent knowledge of Scripture. You are an encouragement to others." },
          ].map((t) => (
            <div
              key={t.tier}
              className="rounded-[20px] p-5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="inline-flex rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-3 py-0.5 text-xs font-bold text-white">
                {t.tier}
              </div>
              <div className="mt-1 text-xs text-white/40">{t.range}</div>
              <p className="mt-2 text-sm leading-6 text-white/70">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="rounded-[28px] p-8 text-center" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Ready to discover where you stand?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/65">
          Take the free quiz now and get a personalized result with your faith tier, what it means,
          and exactly what to do next.
        </p>
        <div className="mt-6">
          <Link
            href="/biblequiz"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Take the Bible Quiz
          </Link>
        </div>
      </section>

    </main>
  );
}
