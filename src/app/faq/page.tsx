import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Faith Companion AI.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "Is Faith Companion AI based on Scripture?",
    a: "Yes. The tools are designed to stay grounded in Scripture and encourage you to verify references in your Bible.",
  },
  {
    q: "What do I get with Premium?",
    a: "Premium removes daily limits and unlocks premium quiz categories and packs.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes (for subscriptions). Lifetime is a one-time payment.",
  },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: x.a,
      },
    })),
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-purple-600 to-orange-500 p-[1px]">
        <div className="rounded-3xl bg-black/35 px-6 py-10 text-center backdrop-blur">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">FAQ</h1>
          <p className="mt-2 text-white/80">Quick answers about the app and Premium.</p>
        </div>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="fc-surface rounded-2xl p-6">
        <div className="space-y-5">
          {FAQS.map((x) => (
            <div key={x.q} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-white font-semibold">{x.q}</div>
              <div className="mt-2 text-white/70 text-sm">{x.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
