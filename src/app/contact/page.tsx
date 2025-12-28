import type { Metadata } from "next";
import BrandHeader from "@/components/BrandHeader";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Faith Companion AI support for questions, feedback, or help with your account or premium subscription.",
  alternates: { canonical: "/contact" },
};

const SUPPORT_EMAIL = "shoptunji@gmail.com";

export default function ContactPage() {
  const subject = encodeURIComponent("Faith Companion AI Support");
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;

  return (
    <div className="space-y-8">
      <BrandHeader
        title="Contact"
        subtitle="Questions, feedback, or support — we’re here to help."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Direct contact */}
        <section className="fc-surface p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Email Support</h2>

          <p className="text-white/75">
            The fastest way to reach us is email. If something isn’t working,
            please include what you were trying to do and any error message you
            saw.
          </p>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wide">
              Email
            </div>
            <a
              href={mailto}
              className="mt-1 inline-flex items-center gap-2 text-white font-semibold underline underline-offset-4 hover:opacity-90"
            >
              {SUPPORT_EMAIL}
              <span className="text-white/50" aria-hidden>
                ↗
              </span>
            </a>
            <p className="mt-2 text-sm text-white/70">
              For premium billing questions, include your PayPal email (if
              applicable).
            </p>
          </div>

          <div className="text-sm text-white/60">
            Typical response time: <span className="text-white/80">1–2 business days</span>
          </div>
        </section>

        {/* Right: Optional form (UX-only for now) */}
        <section className="fc-surface p-6">
          <h2 className="text-lg font-semibold text-white">Send a Message</h2>
          <p className="mt-2 text-white/75">
            Prefer a form? Fill this out and click “Open Email” — it will
            pre-fill a message for you.
          </p>

          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.currentTarget as HTMLFormElement;
              const name = (form.elements.namedItem("name") as HTMLInputElement)
                ?.value;
              const email = (
                form.elements.namedItem("email") as HTMLInputElement
              )?.value;
              const topic = (
                form.elements.namedItem("topic") as HTMLSelectElement
              )?.value;
              const message = (
                form.elements.namedItem("message") as HTMLTextAreaElement
              )?.value;

              const body = encodeURIComponent(
                `Name: ${name || ""}\nEmail: ${email || ""}\nTopic: ${
                  topic || ""
                }\n\nMessage:\n${message || ""}\n`
              );

              window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
            }}
          >
            <div>
              <label className="block text-sm font-medium text-white/70">
                Name (optional)
              </label>
              <input
                name="name"
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70">
                Your email (optional)
              </label>
              <input
                name="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70">
                Topic
              </label>
              <select
                name="topic"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-white/10"
                defaultValue="General"
              >
                <option>General</option>
                <option>Premium / Billing</option>
                <option>Bug / Something not working</option>
                <option>Feature request</option>
                <option>Privacy question</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70">
                Message
              </label>
              <textarea
                name="message"
                rows={6}
                placeholder="Tell us what you need help with…"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-white/10"
              />
              <p className="mt-2 text-xs text-white/50">
                Tip: If reporting a bug, include the page URL and what you clicked.
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
              Open Email
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
