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
            Faith Companion AI respects your privacy. This Privacy Policy explains what information we collect,
            how we use it, and how we protect it.
          </p>

          <h2 className="text-xl font-bold text-white">Information we collect</h2>
          <p>
            We may collect information such as your email address, account activity, saved content,
            subscription status, and limited technical information needed to operate the service.
          </p>

          <h2 className="text-xl font-bold text-white">How we use information</h2>
          <p>
            We use information to provide and improve the service, support account access, process payments,
            deliver saved content, prevent abuse, and respond to support requests.
          </p>

          <h2 className="text-xl font-bold text-white">Payments</h2>
          <p>
            Payments are processed by third-party payment providers such as Stripe. We do not store full payment card details on our servers.
          </p>

          <h2 className="text-xl font-bold text-white">Email and account access</h2>
          <p>
            If you sign in with a magic link, we use your email address to authenticate your access and manage your account.
          </p>

          <h2 className="text-xl font-bold text-white">Data retention</h2>
          <p>
            We retain information for as long as reasonably necessary to operate the service, comply with legal obligations,
            resolve disputes, and enforce agreements.
          </p>

          <h2 className="text-xl font-bold text-white">Your choices</h2>
          <p>
            You may contact us to request help with your account or ask questions about your data.
          </p>

          <h2 className="text-xl font-bold text-white">Contact</h2>
          <p>
            Questions about this Privacy Policy can be sent to{" "}
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