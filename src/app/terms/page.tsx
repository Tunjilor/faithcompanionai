// src/app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for Faith Companion AI.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Terms of Service</h1>

        <div className="mt-6 space-y-5 text-sm leading-7 text-white/75 md:text-base">
          <p>Last updated: April 2026</p>

          <p>
            By accessing or using Faith Companion AI, you agree to these Terms of Service.
          </p>

          <h2 className="text-xl font-bold text-white">Use of the service</h2>
          <p>
            Faith Companion AI provides Scripture-based encouragement, prayers, devotionals, and quiz-related content.
            You agree to use the service lawfully and responsibly.
          </p>

          <h2 className="text-xl font-bold text-white">Accounts</h2>
          <p>
            Some features require an account. You are responsible for maintaining access to your email and for using your account appropriately.
          </p>

          <h2 className="text-xl font-bold text-white">Payments and subscriptions</h2>
          <p>
            Premium access may be offered through recurring or one-time payment plans. Pricing and billing terms are shown at checkout.
          </p>

          <h2 className="text-xl font-bold text-white">No guarantee of outcomes</h2>
          <p>
            Faith Companion AI is provided for spiritual encouragement and convenience. It is not a replacement for church, pastoral care,
            counseling, legal advice, medical care, or professional advice of any kind.
          </p>

          <h2 className="text-xl font-bold text-white">Availability</h2>
          <p>
            We may update, suspend, or discontinue features at any time. We do not guarantee uninterrupted access.
          </p>

          <h2 className="text-xl font-bold text-white">Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a
              href="mailto:support@faithcompanionai.com"
              className="underline underline-offset-4 hover:text-white"
            >
              support@faithcompanionai.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}