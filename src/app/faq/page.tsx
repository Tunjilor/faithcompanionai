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
    a: "Faith Companion AI is an AI-powered platform that provides personalized Scripture, prayers, devotionals, and Bible quiz insights based on your current situation. It is designed to help you stay connected to your faith in a simple, accessible way.",
  },
  {
    q: "Can I use Faith Companion AI for free?",
    a: "Yes. Faith Companion AI offers free access with limited daily usage. Free users can explore features like Scripture generation, prayers, devotionals, and quiz results. Premium unlocks unlimited access and deeper guidance.",
  },
  {
    q: "What does Premium include?",
    a: "Premium gives you unlimited access to all tools, including personalized Scripture, AI-generated prayers, devotionals, and deeper insights based on your faith journey. It is designed for users who want a more consistent and in-depth experience.",
  },
  {
    q: "Is this a replacement for church or pastoral care?",
    a: "No. Faith Companion AI is not a replacement for church, pastoral care, counseling, or personal Bible study. It is designed to support and encourage your faith, not replace real community or guidance.",
  },
  {
    q: "Is the content denominational?",
    a: "Faith Companion AI is broadly Christian and Scripture-based. It is designed to be useful across a wide range of believers rather than tied to a specific denomination.",
  },
  {
    q: "How do I sign in?",
    a: "You can sign in using a secure magic link sent to your email. Simply enter your email address, check your inbox, and click the link to access your account.",
  },
  {
    q: "How does the Bible quiz work?",
    a: "The Bible quiz is designed to give you insight into your current faith journey. You answer a series of questions, and based on your responses, Faith Companion AI provides a result that reflects your strengths, growth areas, and personalized guidance to help you move forward.",
  },
  {
    q: "Is my data private and secure?",
    a: "Yes. We take your privacy seriously. Your account information and activity are handled securely and used only to provide and improve the service. We do not sell your personal data, and payment information is processed securely through trusted third-party providers like Stripe.",
  },
  {
    q: "Can I cancel Premium at any time?",
    a: "Yes. You can cancel your subscription at any time. Your access will continue until the end of your current billing period, and you will not be charged again after cancellation.",
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