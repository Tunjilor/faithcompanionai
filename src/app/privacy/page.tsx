import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Faith Companion AI, premium subscriptions, privacy, and features.",
  alternates: { canonical: "/faq" },
};

import BrandHeader from "@/components/BrandHeader";

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
            Faith Companion AI ("we", "us") respects your privacy. This Privacy Policy
            explains how we collect, use, and protect your information when you use
            our website and services.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>Email address (if you contact us or subscribe)</li>
            <li>Favorites and saved content stored locally in your browser</li>
            <li>Usage data to help improve our service</li>
            <li>
              Payment information (processed securely by PayPal — we never store
              payment details)
            </li>
          </ul>
        </section>

        {/* How We Use Information */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>Provide verses, prayers, and devotionals</li>
            <li>Maintain your subscription and premium access</li>
            <li>Improve app performance and user experience</li>
          </ul>
        </section>

        {/* Data Protection */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Data Protection
          </h2>
          <p className="text-white/80 leading-relaxed">
            We do not sell or share your personal information with third parties.
            All payments are processed securely through trusted third-party
            providers such as PayPal.
          </p>
        </section>

        {/* Cookies / Local Storage */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Cookies & Local Storage
          </h2>
          <p className="text-white/80 leading-relaxed">
            Faith Companion AI uses local storage in your browser to save favorites
            and premium status. This information remains on your device and is not
            transmitted to our servers.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            Contact Us
          </h2>
          <p className="text-white/80">
            If you have questions about this Privacy Policy, you can contact us at:
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

