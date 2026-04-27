"use client";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
] as const;

function getCurrentLocale(): string {
  if (typeof window === "undefined") return "en";
  const segments = window.location.pathname.split("/").filter(Boolean);
  return ["en", "es"].includes(segments[0]) ? segments[0] : "en";
}

function getPathWithoutLocale(): string {
  if (typeof window === "undefined") return "/";
  const segments = window.location.pathname.split("/").filter(Boolean);
  const withoutLocale = ["en", "es"].includes(segments[0]) ? segments.slice(1) : segments;
  return "/" + withoutLocale.join("/");
}

export default function LanguageSwitcher() {
  function switchTo(code: string) {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    window.location.href = `/${code}${getPathWithoutLocale()}`;
  }

  const current = getCurrentLocale();

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold" aria-label="Language switcher">
      {LOCALES.map(({ code, label }, i) => (
        <span key={code} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-white/20">|</span>}
          <button
            type="button"
            onClick={() => switchTo(code)}
            className={
              code === current
                ? "text-white cursor-default"
                : "text-white/40 hover:text-white/80 transition"
            }
            aria-current={code === current ? "true" : undefined}
            disabled={code === current}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}
