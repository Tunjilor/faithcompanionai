import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Faith Companion AI, premium subscriptions, privacy, and features.",
  alternates: { canonical: "/faq" },
};

import BrandHeader from "@/components/BrandHeader";

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <BrandHeader
        title="About Faith Companion AI"
        subtitle="Your personal spiritual companion, powered by AI and grounded in Scripture"
      />

      <section className="brand-surface p-8 space-y-4">
        <h2 className="text-xl font-semibold">Our Mission</h2>
        <p>
          Faith Companion AI exists to help believers deepen their relationship
          with God through simple, daily spiritual practices.
        </p>
        <p>
          We combine the timeless wisdom of Scripture with modern AI technology
          to provide personalized prayers, Bible verses, and devotionals that
          speak directly to your heart and circumstances.
        </p>
        <p>
          Our goal is to make daily spiritual nourishment accessible, meaningful,
          and personal for every believer—wherever they are in their faith
          journey.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {/* Cards for What We Offer */}
      </section>

      <section className="brand-surface p-8 space-y-4">
        <h2 className="text-xl font-semibold">Our Values</h2>
        <ul className="space-y-2">
          <li><strong>Biblical Faithfulness:</strong> Rooted in authentic Scripture and sound theology.</li>
          <li><strong>Personal Relevance:</strong> Content that speaks to real needs.</li>
          <li><strong>Accessibility:</strong> Available anytime, anywhere.</li>
          <li><strong>Privacy & Respect:</strong> Your journey remains yours.</li>
        </ul>
      </section>
    </div>
  );
}

