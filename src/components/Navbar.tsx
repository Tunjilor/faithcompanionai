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

// Clean NAV (no duplicates, no About in Resources dropdown)
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

  {
    type: "menu",
    label: "Resources",
    baseHref: "/resources",
    items: [
      { label: "Christian Living", href: "/resources/christian-living" },
      { label: "Wrapped", href: "/resources/wrapped" },
      { label: "Favorites", href: "/resources/favorites" },
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
  handler: (event: MouseEvent | TouchEvent) => void
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el) return;

      // If clicking inside the element, do nothing
      if (el.contains(event.target as Node)) return;

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;
      if (el.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

function Dropdown({
  label,
  items,
  active,
}: {
  label: string;
  items: Array<{ label: string; href: string }>;
  active: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(wrapRef, () => setOpen(false));

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={classNames(
          "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
          active ? "text-white font-semibold" : "text-white/75 hover:text-white"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <span className={classNames("text-white/60 transition", open && "rotate-180")}>▾</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-black/85 backdrop-blur shadow-lg">
          <div className="py-2">
            {items.map((it) => {
              const activeChild = isActivePath(pathname, it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className={classNames(
                    "block px-4 py-2 text-sm transition",
                    activeChild
                      ? "bg-white/10 text-white font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const desktopItems = useMemo(() => NAV, []);

  return (
    <header className="sticky top-0 z-[100] isolate border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl brand-gradient flex items-center justify-center text-white font-bold">
            F
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-white">Faith Companion AI</div>
            <div className="text-xs text-white/60">Daily verses • prayers • devotionals</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {desktopItems.map((item) => {
            if (item.type === "link") {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    "rounded-xl px-3 py-2 text-sm transition",
                    active ? "text-white font-semibold" : "text-white/75 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            }

            const active =
              (item.baseHref && isActivePath(pathname, item.baseHref)) ||
              item.items.some((x) => isActivePath(pathname, x.href));

            return <Dropdown key={item.label} label={item.label} items={item.items} active={active} />;
          })}

          <Link
            href="/pricing"
            className="ml-2 rounded-full brand-gradient px-4 py-2 text-sm font-semibold text-white hover:opacity-95 transition"
          >
            Premium
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 py-4 space-y-2">
            {NAV.map((item) => {
              if (item.type === "link") {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={classNames(
                      "block rounded-xl px-3 py-2 text-sm",
                      active ? "bg-white/10 text-white font-semibold" : "text-white/80 hover:bg-white/10"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              const active =
                (item.baseHref && isActivePath(pathname, item.baseHref)) ||
                item.items.some((x) => isActivePath(pathname, x.href));

              return (
                <div key={item.label} className="rounded-xl border border-white/10 overflow-hidden">
                  <div className={classNames("px-3 py-2 text-sm", active ? "text-white font-semibold" : "text-white/85")}>
                    {item.label}
                  </div>
                  <div className="pb-2">
                    {item.items.map((it) => {
                      const activeChild = isActivePath(pathname, it.href);
                      return (
                        <Link
                          key={it.href}
                          href={it.href}
                          className={classNames(
                            "block px-5 py-2 text-sm",
                            activeChild ? "bg-white/10 text-white font-semibold" : "text-white/75 hover:bg-white/10"
                          )}
                        >
                          {it.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <Link
              href="/pricing"
              className="block text-center rounded-full brand-gradient px-4 py-3 text-sm font-semibold text-white hover:opacity-95 transition"
            >
              Premium
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


