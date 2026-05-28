// src/app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy for Faith Companion AI.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:p-10">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Privacy Policy</h1>

        <div className="mt-6 space-y-5 text-sm leading-7 text-white/75 md:text-base">
          <p>Last updated: April 2026</p>

          <p>
            Faith Companion AI (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy. This Privacy Policy explains what
            information we collect, how we use it, and how we protect it.
          </p>

          <h2 className="text-xl font-bold text-white">Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="space-y-1 pl-4">
            {[
              ["Account Information", "such as your email address used for login and account access"],
              ["User Content", "including saved items, inputs, and activity within the service"],
              ["Usage Data", "such as interactions with features, pages visited, and general usage patterns"],
              ["Technical Information", "including device type, browser, IP address, and basic system data"],
              ["Subscription Information", "such as your plan status and billing-related metadata"],
            ].map(([label, detail]) => (
              <li key={label} className="flex gap-2">
                <span className="mt-1 shrink-0 text-white/30">&bull;</span>
                <span><span className="font-semibold text-white/90">{label}:</span> {detail}</span>
              </li>
            ))}
          </ul>
          <p>We do not intentionally collect sensitive personal information unless voluntarily provided.</p>

          <h2 className="text-xl font-bold text-white">How We Use Information</h2>
          <p>We use collected information to:</p>
          <ul className="space-y-1 pl-4">
            {[
              "Provide, operate, and improve the service",
              "Personalize your experience and generated content",
              "Authenticate user access and manage accounts",
              "Process payments and manage subscriptions",
              "Store and retrieve saved content",
              "Prevent abuse, fraud, or misuse of the service",
              "Respond to support requests and inquiries",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 shrink-0 text-white/30">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold text-white">AI-Generated Content</h2>
          <p>
            Faith Companion AI uses automated systems to generate responses, including scripture suggestions, prayers, and guidance.
          </p>
          <ul className="space-y-1 pl-4">
            {[
              "Outputs are generated based on user input and system behavior",
              "Results may not always be accurate, complete, or appropriate for every situation",
              "Users are responsible for how they interpret and use generated content",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 shrink-0 text-white/30">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold text-white">Payments</h2>
          <p>
            Payments are processed securely by third-party providers such as Stripe. We do not store full payment card details on our servers.
            Payment information is handled directly by the payment processor under their privacy policies.
          </p>

          <h2 className="text-xl font-bold text-white">Cookies and Tracking</h2>
          <p>We may use cookies or similar technologies to:</p>
          <ul className="space-y-1 pl-4">
            {[
              "Maintain login sessions",
              "Remember user preferences",
              "Improve performance and user experience",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 shrink-0 text-white/30">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>You can manage cookies through your browser settings.</p>

          <h2 className="text-xl font-bold text-white">Third-Party Services</h2>
          <p>
            We may use third-party services to operate the platform, including payment processors (e.g., Stripe),
            hosting and infrastructure providers, and analytics or performance tools. These providers may process
            data as necessary to perform their functions.
          </p>

          <h2 className="text-xl font-bold text-white">Data Retention</h2>
          <p>
            We retain information for as long as reasonably necessary to provide the service, comply with legal
            obligations, resolve disputes, and enforce agreements. We may delete or anonymize data when it is
            no longer needed.
          </p>

          <h2 className="text-xl font-bold text-white">Your Rights and Choices</h2>
          <p>Depending on your location, you may have rights to:</p>
          <ul className="space-y-1 pl-4">
            {[
              "Request access to your data",
              "Request correction or deletion of your data",
              "Request limitation of data use",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 shrink-0 text-white/30">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>To make a request, contact us at the email below.</p>

          <h2 className="text-xl font-bold text-white">Data Security</h2>
          <p>
            We take reasonable measures to protect your information. However, no method of transmission or storage is completely secure.
          </p>

          <h2 className="text-xl font-bold text-white">Children&rsquo;s Privacy</h2>
          <p>
            This service is not intended for children under 13. We do not knowingly collect personal information from children.
          </p>

          <h2 className="text-xl font-bold text-white">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised
            &ldquo;Last updated&rdquo; date.
          </p>

          <h2 className="text-xl font-bold text-white">Contact</h2>
          <p>
            If you have questions about this Privacy Policy, contact:{" "}
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