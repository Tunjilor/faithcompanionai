import BrandHeader from "@/components/BrandHeader";

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <BrandHeader
        title="Terms of Service"
        subtitle="Please review these terms before using Faith Companion AI."
      />

      <div className="fc-surface p-6 space-y-6">
        {/* Introduction */}
        <section>
          <p className="text-white/80 leading-relaxed">
            By using Faith Companion AI, you agree to these Terms of Service. If you
            do not agree with any part of these terms, please do not use the service.
          </p>
        </section>

        {/* Acceptance */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Acceptance of Terms
          </h2>
          <p className="text-white/80 leading-relaxed">
            By accessing and using this website, you accept and agree to be bound
            by the terms and provisions of this agreement.
          </p>
        </section>

        {/* Premium Subscriptions */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Premium Subscriptions
          </h2>
          <p className="text-white/80 leading-relaxed">
            Premium content is available through a monthly subscription of $5.99
            paid via PayPal. Subscriptions automatically renew each month unless
            cancelled.
          </p>
        </section>

        {/* Cancellation */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Cancellation
          </h2>
          <p className="text-white/80 leading-relaxed">
            You may cancel your subscription at any time through your PayPal
            account. Cancellation stops future charges but does not refund past
            payments. Access continues until the end of your current billing
            period.
          </p>
        </section>

        {/* AI Content Disclaimer */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            AI-Generated Content
          </h2>
          <p className="text-white/80 leading-relaxed">
            All verses, prayers, and devotionals provided by Faith Companion AI are
            generated using artificial intelligence for spiritual encouragement.
            This content is not intended as professional counseling, medical advice,
            or a substitute for pastoral care.
          </p>
        </section>

        {/* Use of Content */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Use of Content
          </h2>
          <p className="text-white/80 leading-relaxed">
            You may use generated content for personal spiritual growth and may
            share it on social media. Commercial use of content requires written
            permission.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Limitation of Liability
          </h2>
          <p className="text-white/80 leading-relaxed">
            Faith Companion AI is provided "as is" without warranty of any kind. We
            are not liable for any decisions made based on AI-generated content.
          </p>
        </section>

        {/* Service Continuity */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Service Continuity Disclaimer
          </h2>
          <p className="text-white/80 leading-relaxed">
            Faith Companion AI is operated by an independent creator. While we
            strive to maintain continuous service, we cannot guarantee perpetual
            availability.
          </p>

          <ul className="mt-3 list-disc list-inside text-white/70 space-y-1">
            <li>The service may be discontinued at any time without prior notice</li>
            <li>
              Lifetime access is defined as access for as long as the service
              remains operational
            </li>
            <li>
              No partial or full refunds will be provided if the service becomes
              unavailable
            </li>
            <li>
              You are purchasing access to the service in its current state
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Contact
          </h2>
          <p className="text-white/80">
            For questions about these Terms of Service, please contact us at:
          </p>
          <p className="mt-2 font-medium text-white">
            shoptunji@gmail.com
          </p>
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
