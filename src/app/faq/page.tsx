// src/app/faq/page.tsx
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Faith Companion AI, including pricing, free access, and how the tools work.",
  alternates: {
    canonical: "/faq",
  },
};

const faqs = [
  {
    q: "What is Faith Companion AI?",
    a: "Faith Companion AI is a Christian-focused app experience that helps you generate Scripture-based verses, prayers, devotionals, and Bible quiz results for daily encouragement and growth.",
  },
  {
    q: "Can I use Faith Companion AI for free?",
    a: "Yes. Free users can explore the app with limits. Premium unlocks unlimited usage and saved faith journal access.",
  },
  {
    q: "What does Premium include?",
    a: "Premium unlocks unlimited verses, prayers, and devotionals, along with the ability to save meaningful content to your account.",
  },
  {
    q: "Is this a replacement for church or pastoral care?",
    a: "No. Faith Companion AI is a personal support tool for reflection and encouragement. It is not a replacement for church, pastoral care, counseling, medical care, or professional advice.",
  },
  {
    q: "Is the content denominational?",
    a: "The experience is designed to be broadly Christian, Scripture-grounded, and welcoming to a wide range of believers.",
  },
  {
    q: "How do I sign in?",
    a: "Faith Companion AI uses passwordless sign-in. Enter your email and you will receive a magic link to securely access your account.",
  },
];

export default function FAQPage() {
  const schema = {
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
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <JsonLd data={schema} />

      <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Frequently Asked Questions</h1>

        <div className="mt-8 space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="rounded-[22px] border border-white/10 bg-black/15 p-5"
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
      </div>
    </main>
  );
}