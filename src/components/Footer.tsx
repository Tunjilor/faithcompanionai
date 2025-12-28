import Link from "next/link";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Verse", href: "/tools/verse" },
  { label: "Prayer", href: "/tools/prayer" },
  { label: "Devotional", href: "/tools/devotional" },
  { label: "Quiz", href: "/biblequiz" },
  { label: "Verse Finder", href: "/tools/verse-finder" },
  { label: "Resources", href: "/resources" },
];

const secondaryLinks = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund", href: "/refund" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white font-extrabold">
                F
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-white">Faith Companion AI</div>
                <div className="text-sm text-white/60">
                  Daily verses • prayers • devotionals
                </div>
              </div>
            </div>

            <p className="max-w-md text-sm text-white/70">
              Built to help you find Scripture, generate short prayers, and build
              daily faith habits—fast.
            </p>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Go Premium
            </Link>
          </div>

          {/* Links */}
          <div className="space-y-6 md:justify-self-end">
            <nav aria-label="Primary" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {primaryLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-white/70 hover:text-white transition"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <nav
              aria-label="Secondary"
              className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
            >
              {secondaryLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-white/60 hover:text-white transition"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="my-8 h-px bg-white/10" />

        <div className="flex flex-col gap-3 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <div>© {year} Faith Companion AI — Built with purpose &amp; prayer.</div>
          <div className="text-white/40">
            Questions?{" "}
            <a
              className="underline underline-offset-4 hover:text-white"
              href="mailto:shoptunji@gmail.com?subject=Faith%20Companion%20AI%20Support"
            >
              shoptunji@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
