// src/components/Footer.tsx
import Link from "next/link";

const sitemapLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Tools", href: "/tools/verse" },
  { label: "Resources", href: "/resources" },
  { label: "Quiz", href: "/biblequiz" },
  { label: "Pricing", href: "/pricing" },
];

const toolLinks = [
  { label: "Verse", href: "/tools/verse" },
  { label: "Prayer", href: "/tools/prayer" },
  { label: "Devotional", href: "/tools/devotional" },
];

const legalLinks = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund", href: "/refund" },
];

const ecosystemLinks = [
  { label: "AI Tithe Calculator", href: "https://www.tithecalculatorai.com" },
  { label: "AI Prayer Generator", href: "https://www.prayergeneratorai.com" },
  { label: "Bible Verse Generator AI", href: "https://www.bibleversegeneratorai.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr]">
            <div>
              <div className="flex items-start gap-3">
                <img
                  src="/brand/logo-dark.png"
                  alt="Faith Companion AI"
                  className="mt-1 h-9 w-9 rounded-lg object-contain"
                />
                <div>
                  <div className="font-extrabold text-white">Faith Companion AI</div>
                  <div className="text-sm text-white/60">
                    Daily verses &bull; prayers &bull; devotionals
                  </div>
                </div>
              </div>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
                A calm, Scripture-grounded companion for daily encouragement, reflection, and spiritual growth.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Go Premium
                </Link>

                <Link
                  href="/biblequiz"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Take the Quiz
                </Link>
              </div>

              <p className="mt-4 text-xs leading-6 text-white/45">
                Tip: Share your quiz score to invite friends to beat it.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Sitemap
              </h3>
              <div className="mt-4 space-y-3">
                {sitemapLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-white/75 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Tools
              </h3>
              <div className="mt-4 space-y-3">
                {toolLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-white/75 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Help &amp; Legal
              </h3>
              <div className="mt-4 space-y-3">
                {legalLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-white/75 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 text-sm text-white/60">
                Email
              </div>
              <a
                href="mailto:support@faithcompanionai.com"
                className="mt-1 block text-sm text-white/80 underline underline-offset-4 hover:text-white"
              >
                support@faithcompanionai.com
              </a>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Free Christian AI Tools
              </h3>
              <div className="mt-4 space-y-3">
                {ecosystemLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-white/75 transition hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-white/45">
                Part of the Faith Companion AI ecosystem — free tools for prayer, Bible study, and tithing.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <div>&copy; {new Date().getFullYear()} Faith Companion AI. All rights reserved.</div>
            <div className="flex flex-wrap items-center gap-4">
              <div>Scripture-based support for daily encouragement and growth.</div>
              <a
                href="https://www.producthunt.com/products/faith-companion-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-faith-companion-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-90 transition hover:opacity-100"
              >
                <img
                  alt="Faith Companion AI - Personalized Scripture, prayer &amp; devotionals — just for you | Product Hunt"
                  width="200"
                  height="43"
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1135218&theme=light&t=1777475820795"
                  style={{ width: "200px", height: "43px" }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export { Footer };
