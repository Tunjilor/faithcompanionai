// v2
"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import type { UserData } from "@/context/UserContext";

type NavItem =
  | { type: "link"; label: string; href: string }
  | { type: "menu"; label: string; baseHref?: string; items: Array<{ label: string; href: string }> };

const NAV: NavItem[] = [
  { type: "link", label: "Home", href: "/" },
  { type: "link", label: "Dashboard", href: "/dashboard" },
  { type: "menu", label: "Tools", baseHref: "/tools", items: [
    { label: "Verse", href: "/tools/verse" },
    { label: "Prayer", href: "/tools/prayer" },
    { label: "Devotional", href: "/tools/devotional" },
    { label: "Bible Search", href: "/tools/bible-search" },
    { label: "Share Card", href: "/tools/share-card" },
  ]},
  { type: "link", label: "Quiz", href: "/biblequiz" },
  { type: "link", label: "Resources", href: "/resources" },
  { type: "menu", label: "More", items: [
    { label: "Saved", href: "/saved" },
    { label: "Blog", href: "/blog" },
    { label: "Topics", href: "/topics/anxiety" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Refund", href: "/refund" },
  ]},
];

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
function isPremiumActive(me: UserData) {
  const premiumFlag = !!(me.isPremium || me.premium);
  if (!premiumFlag) return false;
  if (!me.premiumUntil) return true;
  return new Date(me.premiumUntil).getTime() > Date.now();
}
function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}

function Dropdown({ label, items, baseHref }: { label: string; items: Array<{ label: string; href: string }>; baseHref?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const anyActive = useMemo(() => {
    if (baseHref && isActivePath(pathname, baseHref)) return true;
    return items.some((it) => isActivePath(pathname, it.href));
  }, [pathname, items, baseHref]);
  useOnClickOutside(wrapRef, () => setOpen(false), open);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  return (
    <div className="relative" ref={wrapRef}>
      <button type="button" onClick={() => setOpen((v) => !v)}
        className={classNames("inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
          anyActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white")}
        aria-haspopup="menu" aria-expanded={open}>
        {label}<span className={classNames("transition", open && "rotate-180")}>▾</span>
      </button>
      {open && (
        <div role="menu" className="absolute left-0 mt-2 w-60 overflow-hidden rounded-xl border border-white/10 bg-black/80 shadow-lg backdrop-blur">
          {items.map((it) => (
            <Link key={it.href} href={it.href} onClick={() => setOpen(false)}
              className={classNames("block px-4 py-2 text-sm transition",
                isActivePath(pathname, it.href) ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white")}
              role="menuitem">{it.label}</Link>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountMenu({ me }: { me: UserData }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const signedIn = !!(me.signedIn || me.authed);
  const premiumActive = isPremiumActive(me);
  useOnClickOutside(wrapRef, () => setOpen(false), open);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  async function handleLogout() {
    try {
      setLoggingOut(true);
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      window.location.href = "/login";
    } catch { setLoggingOut(false); }
  }
  if (!signedIn) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link href="/login" className={classNames("rounded-md px-3 py-2 text-sm font-medium transition",
          isActivePath(pathname, "/login") ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white")}>Sign in</Link>
        <Link href="/pricing" className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-3 py-2 text-sm font-semibold text-white hover:opacity-95">Premium</Link>
      </div>
    );
  }
  return (
    <div className="relative hidden md:block" ref={wrapRef}>
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
        aria-haspopup="menu" aria-expanded={open}>
        <span className="max-w-[160px] truncate">{me.displayName || me.email || "Account"}</span>
        {premiumActive && <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-semibold text-amber-200">Premium</span>}
        <span className={classNames("transition", open && "rotate-180")}>▾</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-black/80 shadow-lg backdrop-blur">
          <div className="border-b border-white/10 px-4 py-3">
            <div className="truncate text-sm font-semibold text-white">{me.displayName || me.email || "Account"}</div>
            {me.displayName && <div className="truncate text-xs text-white/40">{me.email}</div>}
            <div className="mt-1 text-xs text-white/50">{premiumActive ? "Premium active" : "Free account"}</div>
          </div>
          <Link href="/dashboard" className="block px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link href="/saved" className="block px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}>Saved</Link>
          <Link href="/profile" className="block px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}>Profile &amp; Settings</Link>
          <Link href="/pricing" className="block px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}>
            {premiumActive ? "Manage plan" : "Upgrade to Premium"}
          </Link>
          <button type="button" onClick={handleLogout} disabled={loggingOut}
            className="block w-full px-4 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-60">
            {loggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSections, setMobileSections] = useState<Record<string, boolean>>({ Tools: false, More: false });
  const me = useUser();
  useEffect(() => { setMobileOpen(false); }, [pathname]);
  const signedIn = !!(me.signedIn || me.authed);
  const premiumActive = isPremiumActive(me);
  function toggleSection(label: string) {
    setMobileSections((prev) => ({ ...prev, [label]: !prev[label] }));
  }
  async function handleMobileLogout() {
    try { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; } catch {}
  }
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
              src="/icons/icon-192.png"
              alt="Faith Companion AI"
              width={36}
              height={36}
              className="rounded-xl ring-1 ring-white/25"
              priority
            />
          <div className="hidden leading-tight sm:block">
            <div className="font-extrabold text-white">Faith Companion</div>
            <div className="text-sm text-orange-400">AI</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => {
              if (item.type === "menu") return <Dropdown key={item.label} label={item.label} items={item.items} baseHref={item.baseHref} />;
              return (
                <Link key={item.href} href={item.href}
                  className={classNames("rounded-md px-3 py-2 text-sm font-medium transition",
                    isActivePath(pathname, item.href) ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white")}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <AccountMenu me={me} />
          <button type="button"
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMobileOpen((v) => !v)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>
            ☰
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-col gap-2">
              {NAV.map((item) => {
                if (item.type === "menu") {
                  const open = !!mobileSections[item.label];
                  const anyActive = (item.baseHref && isActivePath(pathname, item.baseHref)) || item.items.some((it) => isActivePath(pathname, it.href));
                  return (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-white/5">
                      <button type="button" onClick={() => toggleSection(item.label)}
                        className={classNames("flex w-full items-center justify-between px-3 py-3 text-sm font-semibold", anyActive ? "text-white" : "text-white/80")}>
                        <span>{item.label}</span>
                        <span className={classNames("transition", open && "rotate-180")}>▾</span>
                      </button>
                      {open && (
                        <div className="border-t border-white/10 p-2">
                          {item.items.map((it) => (
                            <Link key={it.href} href={it.href} onClick={() => setMobileOpen(false)}
                              className={classNames("block rounded-md px-3 py-2 text-sm transition",
                                isActivePath(pathname, it.href) ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white")}>
                              {it.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className={classNames("rounded-md px-3 py-2 text-sm font-medium transition",
                      isActivePath(pathname, item.href) ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10 hover:text-white")}>
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3">
                {signedIn ? (
                  <>
                    <div className="text-sm font-semibold text-white">{me.displayName || me.email || "Account"}</div>
                    {me.displayName && <div className="truncate text-xs text-white/40">{me.email}</div>}
                    <div className="mt-1 text-xs text-white/50">{premiumActive ? "Premium active" : "Free account"}</div>
                    <div className="mt-3 flex flex-col gap-2">
                      <Link href="/profile" onClick={() => setMobileOpen(false)}
                        className="rounded-md border border-white/10 px-3 py-2 text-center text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white">Profile &amp; Settings</Link>
                      <Link href="/saved" onClick={() => setMobileOpen(false)}
                        className="rounded-md border border-white/10 px-3 py-2 text-center text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white">Saved</Link>
                      <Link href="/pricing" onClick={() => setMobileOpen(false)}
                        className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-3 py-2 text-center text-sm font-semibold text-white">
                        {premiumActive ? "Manage plan" : "Upgrade to Premium"}
                      </Link>
                      <button type="button" onClick={handleMobileLogout}
                        className="rounded-md border border-white/10 px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white">Log out</button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="rounded-md border border-white/10 px-3 py-2 text-center text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white">Sign in</Link>
                    <Link href="/pricing" onClick={() => setMobileOpen(false)}
                      className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-3 py-2 text-center text-sm font-semibold text-white">Premium</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

