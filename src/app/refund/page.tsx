import type { Metadata } from "next";
import BrandHeader from "@/components/BrandHeader";

export const metadata: Metadata = {
  title: "Refund Policy | Faith Companion AI",
  description:
    "Understand how cancellations and refund requests work for Faith Companion AI subscriptions processed via Stripe.",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <div className="space-y-8">
      <BrandHeader
        title="Refund Policy"
        subtitle="How refunds work for Faith Companion AI subscriptions."
      />

      <div className="fc-surface p-6 space-y-6">
        {/* Introduction */}
        <section>
          <p className="text-white/80 leading-relaxed">
            Because Faith Companion AI provides instant access to digital content upon subscription,
            subscription payments are generally non-refundable.
          </p>
        </section>

        {/* Digital Content Nature */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Digital Content Nature</h2>
          <p className="text-white/80 leading-relaxed">
            As a digital service providing immediate access to AI-generated verses, prayers,
            and devotionals, premium subscriptions are considered final upon purchase.
          </p>
        </section>

        {/* Cancellation */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Cancellation</h2>
          <p className="text-white/80 leading-relaxed">
            You may cancel your subscription at any time to prevent future billing. Your access
            will continue until the end of your current billing period.
          </p>
        </section>

        {/* Exceptions */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Exceptions</h2>
          <p className="text-white/80 leading-relaxed">
            Refunds may be considered on a case-by-case basis for:
          </p>
          <ul className="mt-3 list-disc list-inside text-white/70 space-y-1">
            <li>Technical errors resulting in duplicate charges</li>
            <li>Service unavailability for extended periods</li>
          </ul>
          <p className="mt-3 text-white/80 leading-relaxed">
            If approved, refunds are issued back to the original payment method via Stripe.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Contact Us</h2>
          <p className="text-white/80">
            For questions or exceptional circumstances, contact:
          </p>
          <p className="mt-2 font-medium text-white">support@faithcompanionai.com</p>
        </section>

        {/* Last Updated */}
        <section className="pt-4 border-t border-white/10">
          <p className="text-sm text-white/50">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
}
