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

          <p>
            We want Faith Companion AI to be straightforward and fair.
          </p>

          <h2 className="text-xl font-bold text-white">Subscriptions</h2>
          <p>
            Subscription purchases are generally non-refundable once billed, except where required by law
            or where we decide otherwise in our discretion.
          </p>

          <h2 className="text-xl font-bold text-white">One-time payments</h2>
          <p>
            One-time purchases such as lifetime access are generally non-refundable once granted,
            except where required by law or where we decide otherwise in our discretion.
          </p>

          <h2 className="text-xl font-bold text-white">Billing issues</h2>
          <p>
            If you believe you were charged incorrectly, contact us and we will review the issue.
          </p>

          <h2 className="text-xl font-bold text-white">Contact</h2>
          <p>
            Refund and billing questions can be sent to{" "}
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