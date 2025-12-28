import Link from "next/link";

const sitemap = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Tools", href: "/tools/verse" }, // representative entry
  { label: "Community", href: "/community/prayer-wall" },
  { label: "Quiz", href: "/biblequiz" },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
];

const tools = [
  { label: "Verse", href: "/tools/verse" },
  { label: "Prayer", href: "/tools/prayer" },
  { label: "Devotional", href: "/tools/devotional" },
  { label: "Prayer Journal", href: "/tools/prayer-journal" },
  { label: "Scripture Memory", href: "/tools/scripture-memory" },
  { label: "Verse Finder", href: "/tools/verse-finder" },
];

const legal = [
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
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
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

            <p className="text-sm text-white/70">
              A calm, Scripture-grounded companion for daily encouragement and growth.
            </p>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Go Premium
            </Link>
          </div>

          {/* Sitemap */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-white">Sitemap</div>
            <nav className="grid gap-2 text-sm">
              {sitemap.map((l) => (
                <Link key={l.href} href={l.href} className="text-white/70 hover:text-white transition">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Tools */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-white">Tools</div>
            <nav className="grid gap-2 text-sm">
              {tools.map((l) => (
                <Link key={l.href} href={l.href} className="text-white/70 hover:text-white transition">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal + Help */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-white">Help & Legal</div>
            <nav className="grid gap-2 text-sm">
              {legal.map((l) => (
                <Link key={l.href} href={l.href} className="text-white/70 hover:text-white transition">
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="pt-2 text-sm text-white/60">
              Email:{" "}
              <a
                className="underline underline-offset-4 hover:text-white"
                href="mailto:shoptunji@gmail.com?subject=Faith%20Companion%20AI%20Support"
              >
                shoptunji@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-white/10" />

        <div className="flex flex-col gap-3 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <div>© {year} Faith Companion AI — Built with purpose &amp; prayer.</div>
          <div className="text-white/40">
            Mobile-friendly • SEO-ready internal links
          </div>
        </div>
      </div>
    </footer>
  );
}
