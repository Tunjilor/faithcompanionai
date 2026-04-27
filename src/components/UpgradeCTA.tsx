// src/components/UpgradeCTA.tsx
import Link from "next/link";

type UpgradeCTAVariant = "default" | "soft" | "hard_stop" | "inline" | "dashboard";

type UpgradeCTAProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  variant?: UpgradeCTAVariant;
  showFeatures?: boolean;
  className?: string;
};

function getVariantClasses(variant: UpgradeCTAVariant) {
  switch (variant) {
    case "soft":
      return {
        wrapper:
          "rounded-2xl border border-amber-200 bg-amber-50 p-4",
        title: "text-sm font-semibold text-amber-900",
        desc: "mt-1 text-sm leading-6 text-amber-800",
        secondary:
          "inline-flex min-h-[44px] items-center justify-center rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100",
      };

    case "hard_stop":
      return {
        wrapper:
          "rounded-2xl border border-red-200 bg-red-50 p-5",
        title: "text-base font-bold text-red-900",
        desc: "mt-2 text-sm leading-6 text-red-800",
        secondary:
          "inline-flex min-h-[48px] items-center justify-center rounded-full border border-red-300 bg-white px-5 py-3 text-sm font-semibold text-red-800 transition hover:bg-red-100",
      };

    case "inline":
      return {
        wrapper:
          "rounded-2xl border border-slate-200 bg-white p-4",
        title: "text-sm font-semibold text-slate-900",
        desc: "mt-1 text-sm leading-6 text-slate-600",
        secondary:
          "inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50",
      };

    case "dashboard":
      return {
        wrapper:
          "rounded-2xl border border-white/10 bg-white/5 p-5",
        title: "text-base font-bold text-white",
        desc: "mt-2 text-sm leading-6 text-white/75",
        secondary:
          "inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15",
      };

    case "default":
    default:
      return {
        wrapper:
          "rounded-2xl border border-slate-200 bg-slate-50 p-5",
        title: "text-base font-bold text-slate-900",
        desc: "mt-2 text-sm leading-6 text-slate-700",
        secondary:
          "inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100",
      };
  }
}

export default function UpgradeCTA({
  title = "Upgrade to Premium",
  description = "Unlock unlimited verses, prayers, devotionals, and saved faith journal access.",
  primaryHref = "/pricing",
  primaryLabel = "Upgrade to Premium",
  secondaryHref,
  secondaryLabel,
  variant = "default",
  showFeatures = true,
  className = "",
}: UpgradeCTAProps) {
  const styles = getVariantClasses(variant);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.title}>{title}</div>
      <p className={styles.desc}>{description}</p>

      {showFeatures && (
        <div className="mt-4 grid gap-2 text-sm">
          <div className={variant === "dashboard" ? "text-white/85" : "text-slate-800"}>
            ✓ Unlimited verses, prayers, and devotionals
          </div>
          <div className={variant === "dashboard" ? "text-white/85" : "text-slate-800"}>
            ✓ Save your spiritual journey to your account
          </div>
          <div className={variant === "dashboard" ? "text-white/85" : "text-slate-800"}>
            ✓ Build your personal faith journal over time
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={primaryHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {primaryLabel}
        </Link>

        {secondaryHref && secondaryLabel && (
          <Link href={secondaryHref} className={styles.secondary}>
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
export { UpgradeCTA };
