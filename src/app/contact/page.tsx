// src/app/contact/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Faith Companion AI for support, account help, billing questions, or general feedback.",
  alternates: {
    canonical: "/contact",
  },
};

const helpTopics = [
  {
    title: "Account Support",
    description:
      "Need help signing in, accessing your account, or managing your saved content?",
  },
  {
    title: "Billing Questions",
    description:
      "Questions about Premium, subscriptions, pricing, or charges?",
  },
  {
    title: "General Feedback",
    description:
      "Have a suggestion, found a bug, or want to share your experience?",
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Contact</h1>

          <p className="mt-4 text-sm leading-7 text-white/75 md:text-base">
            Whether you need support, have a billing question, or want to share feedback,
            we&rsquo;d love to hear from you.
          </p>

          <div className="mt-6 rounded-[22px] border border-white/10 bg-black/15 p-5">
            <div className="text-sm font-semibold text-white/70">Support Email</div>
            <a
              href="mailto:support@faithcompanionai.com?subject=Faith%20Companion%20AI%20Support"
              className="mt-2 inline-block text-base font-semibold text-white underline underline-offset-4 hover:text-orange-300"
            >
              support@faithcompanionai.com
            </a>
            <p className="mt-3 text-sm leading-7 text-white/65">
              For the fastest help, please include:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-white/65">
              {[
                "A short description of the issue",
                "The email address tied to your account (if applicable)",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 shrink-0 text-white/30">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {helpTopics.map((item) => (
          <div
            key={item.title}
            className="rounded-[24px] border border-white/10 bg-white/5 p-6"
          >
            <h2 className="text-lg font-bold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-8 md:p-10">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Before you email us
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-[22px] border border-white/10 bg-black/15 p-5">
            <h3 className="text-base font-semibold text-white">Check the FAQ</h3>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Many common questions about accounts, Premium, and free usage are already answered there.
            </p>
            <p className="mt-1 text-xs text-white/40">Visit FAQ &rarr;</p>
            <Link
              href="/faq"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Visit FAQ
            </Link>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-black/15 p-5">
            <h3 className="text-base font-semibold text-white">Review Pricing</h3>
            <p className="mt-2 text-sm leading-7 text-white/70">
              If your question is about Premium access or what&rsquo;s included, you may find your answer here.
            </p>
            <p className="mt-1 text-xs text-white/40">View Pricing &rarr;</p>
            <Link
              href="/pricing"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-white/50">
        We aim to respond as quickly as possible and appreciate your patience.
      </p>
    </main>
  );
}