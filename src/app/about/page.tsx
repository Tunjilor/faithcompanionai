import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Faith Companion AI—your personal spiritual companion powered by AI and grounded in Scripture.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="space-y-10">
      {/* Hero */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-white">
          About <span className="bg-gradient-to-r from-purple-500 to-orange-400 bg-clip-text text-transparent">Faith Companion AI</span>
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Your personal spiritual companion, powered by AI and grounded in Scripture
        </p>
      </section>

      {/* Mission */}
      <section className="fc-surface p-6 md:p-8">
        <h2 className="text-xl font-bold text-white">Our Mission</h2>
        <p className="mt-3 text-white/70 leading-relaxed">
          Faith Companion AI exists to help believers deepen their relationship with God through daily spiritual
          practices. We combine the timeless wisdom of Scripture with modern AI technology to provide personalized
          prayers, Bible verses, and devotionals that speak directly to your heart and circumstances.
        </p>
        <p className="mt-4 text-white/70 leading-relaxed">
          Our goal is to make daily spiritual nourishment accessible, meaningful, and personal for every believer,
          wherever they are in their faith journey.
        </p>
      </section>

      {/* What we offer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-white text-center">What We Offer</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="fc-surface p-6">
            <div className="text-lg font-bold text-white">Daily Bible Verses</div>
            <p className="mt-2 text-white/70">
              Receive personalized Scripture from your preferred translation, accompanied by thoughtful reflections and prayers.
            </p>
          </div>

          <div className="fc-surface p-6">
            <div className="text-lg font-bold text-white">AI-Generated Prayers</div>
            <p className="mt-2 text-white/70">
              Custom prayers crafted for your specific needs, whether it&apos;s healing, guidance, gratitude, or strength.
            </p>
          </div>

          <div className="fc-surface p-6">
            <div className="text-lg font-bold text-white">Daily Devotionals</div>
            <p className="mt-2 text-white/70">
              Complete devotionals with Scripture, reflection, life application, and prayer to start or end your day.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="fc-surface p-6 md:p-8">
        <h2 className="text-xl font-bold text-white">Our Values</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="font-semibold text-white">Biblical Faithfulness</div>
            <p className="mt-1 text-white/70">
              Every piece of content is rooted in authentic Scripture and sound Christian theology.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white">Personal Relevance</div>
            <p className="mt-1 text-white/70">
              We believe spiritual content should speak to your current needs and circumstances.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white">Accessibility</div>
            <p className="mt-1 text-white/70">
              Faith resources should be available to everyone, anytime, anywhere.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white">Privacy &amp; Respect</div>
            <p className="mt-1 text-white/70">
              Your spiritual journey is personal. We respect your privacy and never share your data.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-white text-center">How It Works</h2>

        <div className="fc-surface p-6 md:p-8">
          <ol className="space-y-3 text-white/70">
            <li><span className="font-semibold text-white">1. Choose Your Need:</span> Select what you need today—a verse for encouragement, a prayer for healing, or a devotional for reflection.</li>
            <li><span className="font-semibold text-white">2. AI Creates Personalized Content:</span> Our AI analyzes your selection and generates biblically accurate, heartfelt content tailored to you.</li>
            <li><span className="font-semibold text-white">3. Reflect &amp; Save:</span> Read, reflect, and save your favorites for future reference. Share them with friends or on social media.</li>
            <li><span className="font-semibold text-white">4. Grow Daily:</span> Return each day for fresh spiritual nourishment and watch your faith deepen.</li>
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-3 pb-4">
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
        >
          Go Premium Today
        </Link>
        <div>
          <Link href="/" className="text-sm text-white/70 underline underline-offset-4 hover:text-white">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
