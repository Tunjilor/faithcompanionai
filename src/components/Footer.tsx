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
  { label: "Support", href: "/support" }, // optional link
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund", href: "/refund" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl brand-gradient flex items-center justify-center text-white font-extrabold">
                F
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-slate-900">Faith Companion AI</div>
                <div className="text-sm text-slate-600">Daily verses • prayers • devotionals</div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm text-slate-700">
              Built to help you find Scripture, generate short prayers, and build daily faith habits—fast.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-700 md:justify-end">
            {primaryLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-slate-900 transition">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="my-8 h-px bg-black/10" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            {secondaryLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-slate-900 transition">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="text-sm text-slate-600">© {year} Faith Companion AI — Built with purpose &amp; prayer.</div>
        </div>
      </div>
    </footer>
  );
}
