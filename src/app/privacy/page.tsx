import type { Metadata } from "next";
import BrandHeader from "@/components/BrandHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | Faith Companion AI",
  description:
    "Learn how Faith Companion AI collects, uses, and protects your information, including subscription payments processed securely by Stripe.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <BrandHeader
        title="Privacy Policy"
        subtitle="Your privacy matters. Here’s how we protect and respect your information."
      />

      <div className="fc-surface p-6 space-y-6">
        {/* Introduction */}
        <section>
          <p className="text-white/80 leading-relaxed">
            Faith Companion AI (&quot;we&quot;, &quot;us&quot;) respects your privacy. This Privacy Policy
            explains how we collect, use, and protect your information when you use
            our website and services.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Information We Collect</h2>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>Email address (if you contact us or create an account)</li>
            <li>Favorites and saved content stored locally in your browser</li>
            <li>Basic usage data to help improve our service</li>
            <li>
              Payment information (processed securely by Stripe — we never store
              your full payment details)
            </li>
          </ul>
        </section>

        {/* How We Use Information */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">How We Use Your Information</h2>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>Provide verses, prayers, and devotionals</li>
            <li>Maintain your subscription and premium access</li>
            <li>Improve performance, reliability, and user experience</li>
            <li>Respond to support requests</li>
          </ul>
        </section>

        {/* Data Protection */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Data Protection</h2>
          <p className="text-white/80 leading-relaxed">
            We do not sell your personal information. We only share information with
            trusted service providers when necessary to operate the service
            (for example, Stripe for payment processing).
          </p>
        </section>

        {/* Cookies / Local Storage */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Cookies &amp; Local Storage</h2>
          <p className="text-white/80 leading-relaxed">
            Faith Companion AI may use cookies and/or local storage to support core features
            such as saving favorites and remembering subscription status. Where local storage
            is used, that information remains on your device unless you clear your browser data.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Contact Us</h2>
          <p className="text-white/80">
            If you have questions about this Privacy Policy, contact us at:
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
