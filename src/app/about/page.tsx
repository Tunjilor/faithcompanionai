import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Faith Companion AI — an AI-powered spiritual companion grounded in Scripture.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="fc-surface p-8 md:p-10">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">
          About Faith Companion AI
        </h1>
        <p className="mt-3 text-lg text-white/70">
          Your personal spiritual companion, powered by AI and grounded in Scripture
        </p>
      </section>

      {/* Mission */}
      <section className="fc-surface p-6 md:p-8">
        <h2 className="text-xl font-bold text-white">Our Mission</h2>
        <p className="mt-3 text-white/70 leading-relaxed">
          Faith Companion AI exists to help believers deepen their relationship with God
          through daily spiritual practices. We combine the timeless wisdom of Scripture
          with modern AI technology to provide personalized prayers, Bible verses, and
          devotionals that speak directly to your heart and circumstances.
        </p>
        <p className="mt-4 text-white/70 leading-relaxed">
          Our goal is to make daily spiritual nourishment accessible, meaningful, and
          personal for every believer, wherever they are in their faith journey.
        </p>
      </section>

      {/* What we offer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">What We Offer</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="fc-surface p-6">
            <h3 className="font-semibold text-white">Daily Bible Verses</h3>
            <p className="mt-2 text-white/70">
              Receive personalized Scripture from your preferred translation, accompanied
              by thoughtful reflections and prayers.
            </p>
          </div>

          <div className="fc-surface p-6">
            <h3 className="font-semibold text-white">AI-Generated Prayers</h3>
            <p className="mt-2 text-white/70">
              Custom prayers crafted for your specific needs, whether it's healing,
              guidance, gratitude, or strength.
            </p>
          </div>

          <div className="fc-surface p-6">
            <h3 className="font-semibold text-white">Daily Devotionals</h3>
            <p className="mt-2 text-white/70">
              Complete devotionals with Scripture, reflection, life application, and
              prayer to start or end your day.
            </p>
          </div>
        </div>
      </section>

      {/* Values + How it works */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="fc-surface p-6 md:p-8">
          <h2 className="text-xl font-bold text-white">Our Values</h2>
          <ul className="mt-4 space-y-3 text-white/70">
            <li>
              <span className="font-semibold text-white">Biblical Faithfulness:</span>{" "}
              Every piece of content is rooted in authentic Scripture and sound Christian theology.
            </li>
            <li>
              <span className="font-semibold text-white">Personal Relevance:</span>{" "}
              We believe spiritual content should speak to your current needs and circumstances.
            </li>
            <li>
              <span className="font-semibold text-white">Accessibility:</span>{" "}
              Faith resources should be available to everyone, anytime, anywhere.
            </li>
            <li>
              <span className="font-semibold text-white">Privacy & Respect:</span>{" "}
              Your spiritual journey is personal. We respect your privacy and never share your data.
            </li>
          </ul>
        </div>

        <div className="fc-surface p-6 md:p-8">
          <h2 className="text-xl font-bold text-white">How It Works</h2>
          <ol className="mt-4 space-y-3 text-white/70 list-decimal pl-5">
            <li>
              <span className="font-semibold text-white">Choose Your Need:</span>{" "}
              Select what you need today—a verse for encouragement, a prayer for healing, or a devotional for reflection.
            </li>
            <li>
              <span className="font-semibold text-white">AI Creates Personalized Content:</span>{" "}
              Our AI analyzes your selection and generates biblically accurate, heartfelt content tailored to you.
            </li>
            <li>
              <span className="font-semibold text-white">Reflect & Save:</span>{" "}
              Read, reflect, and save your favorites for future reference. Share them with friends or on social media.
            </li>
            <li>
              <span className="font-semibold text-white">Grow Daily:</span>{" "}
              Return each day for fresh spiritual nourishment and watch your faith deepen.
            </li>
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="fc-surface p-6 md:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-semibold text-white">Ready to go deeper?</div>
          <div className="text-white/70">Unlock premium tools, quizzes, and more.</div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/pricing"
            className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Go Premium Today
          </Link>
          <Link
            href="/"
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
