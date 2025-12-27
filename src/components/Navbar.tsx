"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

type NavItem =
  | { type: "link"; label: string; href: string }
  | {
      type: "menu";
      label: string;
      baseHref?: string;
      items: Array<{ label: string; href: string }>;
    };

// Matches your existing Next.js routes (from your src/app tree)
const NAV: NavItem[] = [
  { type: "link", label: "Home", href: "/" },
  { type: "link", label: "Dashboard", href: "/dashboard" },

  {
    type: "menu",
    label: "Tools",
    baseHref: "/tools",
    items: [
      { label: "Verse", href: "/tools/verse" },
      { label: "Prayer", href: "/tools/prayer" },
      { label: "Devotional", href: "/tools/devotional" },
      { label: "Prayer Journal", href: "/tools/prayer-journal" },
      { label: "Scripture Memory", href: "/tools/scripture-memory" },
      { label: "Verse Finder", href: "/tools/verse-finder" },
    ],
  },

  {
    type: "menu",
    label: "Community",
    baseHref: "/community",
    items: [{ label: "Prayer Wall", href: "/community/prayer-wall" }],
  },

  { type: "link", label: "Quiz", href: "/biblequiz" },
  { type: "link", label: "Resources", href: "/resources" },

  {
    type: "menu",
    label: "More",
    items: [
      { label: "Christian Living", href: "/resources/christian-living" },
      { label: "Favorites", href: "/resources/favorites" },
      { label: "About", href: "/about" },
      // Wrapped intentionally removed ✅
    ],
  },

  { type: "link", label: "Pricing", href: "/pricing" },
];

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;
      if (el.contains(event.target as Node)) return;
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

function Dropdown({
  label,
  items,
  baseHref,
}: {
  label: string;
  items: Array<{ label: string; href: string }>;
  baseHref?: string;
}) {
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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={classNames(
          "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
          anyActive
            ? "bg-white/10 text-white"
            : "text-white/80 hover:text-white hover:bg-white/10"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <span className={classNames("transition", open && "rotate-180")}>▾</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-black/70 backdrop-blur shadow-lg"
        >
          {items.map((it) => {
            const active = isActivePath(pathname, it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className={classNames(
                  "block px-4 py-2 text-sm transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
                role="menuitem"
              >
                {it.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white">
            ✝
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">
              Faith Companion AI
            </div>
            <div className="text-xs text-white/60">
              Daily verse • prayer • hope
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              if (item.type === "menu") {
                return (
                  <Dropdown
                    key={item.label}
                    label={item.label}
                    items={item.items}
                    baseHref={item.baseHref}
                  />
                );
              }

              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    "rounded-md px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Premium button (matches your Base44 feel) */}
          <Link
            href="/pricing"
            className="hidden rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-3 py-2 text-sm font-semibold text-white hover:opacity-95 md:inline-flex"
          >
            Premium
          </Link>

          {/* Mobile button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex flex-col gap-1">
              {NAV.map((item) => {
                if (item.type === "menu") {
                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/10 bg-white/5 p-2"
                    >
                      <div className="px-2 pb-2 text-xs font-semibold text-white/70">
                        {item.label}
                      </div>
                      <div className="flex flex-col">
                        {item.items.map((it) => (
                          <Link
  key={it.href}
  href={it.href}
  onClick={() => setMobileOpen(false)}
  className="rounded-md px-2 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
>
  {it.label}
</Link>

                        ))}
                      </div>
                    </div>
                  );
                }

                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={classNames(
                      "rounded-md px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/pricing"
                className="mt-2 rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Premium
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

