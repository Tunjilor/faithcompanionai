import BrandHeader from "@/components/BrandHeader";

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
            Because Faith Companion AI provides instant access to digital content
            upon subscription, subscription payments are non-refundable.
          </p>
        </section>

        {/* Digital Content Nature */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Digital Content Nature
          </h2>
          <p className="text-white/80 leading-relaxed">
            As a digital service providing immediate access to AI-generated Bible
            verses, prayers, and devotionals, all premium subscriptions are final
            upon purchase.
          </p>
        </section>

        {/* Cancellation */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Cancellation</h2>
          <p className="text-white/80 leading-relaxed">
            You may cancel your subscription at any time through your PayPal
            account to prevent future billing. Your access will continue until the
            end of your current billing period.
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
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Contact Us</h2>
          <p className="text-white/80">
            For questions or exceptional circumstances, contact:
          </p>
          <p className="mt-2 font-medium text-white">shoptunji@gmail.com</p>
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
