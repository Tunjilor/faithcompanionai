// src/app/refund/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Read the Refund Policy for Faith Companion AI.",
  alternates: {
    canonical: "/refund",
  },
};

export default function RefundPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Refund Policy</h1>

        <div className="mt-6 space-y-5 text-sm leading-7 text-white/75 md:text-base">
          <p>Last updated: April 2026</p>

          <p>We aim to keep Faith Companion AI simple, fair, and transparent.</p>

          <h2 className="text-xl font-bold text-white">Subscriptions</h2>
          <p>Subscription purchases are generally non-refundable once billed. By purchasing a subscription:</p>
          <ul className="space-y-1 pl-4">
            {[
              "You agree that billing may recur automatically unless canceled",
              "You are responsible for canceling before the next billing cycle if you do not wish to be charged again",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 shrink-0 text-white/30">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            We do not provide partial refunds for unused time, except where required by law or at our sole discretion.
          </p>

          <h2 className="text-xl font-bold text-white">One-Time Payments</h2>
          <p>
            One-time purchases, including lifetime access, are generally non-refundable once access has been granted.
            Exceptions may be made where required by law or at our sole discretion.
          </p>

          <h2 className="text-xl font-bold text-white">Billing Issues</h2>
          <p>
            If you believe you were charged in error, please contact us as soon as possible. We will review
            billing concerns on a case-by-case basis.
          </p>

          <h2 className="text-xl font-bold text-white">Cancellations</h2>
          <p>
            You may cancel your subscription at any time. Cancellation will take effect at the end of the
            current billing period, and you will retain access until that time.
          </p>

          <h2 className="text-xl font-bold text-white">Contact</h2>
          <p>
            For refund or billing questions, contact:{" "}
            <a
              href="mailto:support@faithcompanionai.com"
              className="underline underline-offset-4 hover:text-white"
            >
              support@faithcompanionai.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}