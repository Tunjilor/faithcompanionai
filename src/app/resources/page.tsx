import BrandHeader from "@/components/BrandHeader";
import Link from "next/link";

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <BrandHeader
        title="Resources"
        subtitle="Helpful faith content to support your daily walk."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/resources/christian-living"
          className="fc-surface p-6 hover:bg-white/10 transition"
        >
          <div className="text-white font-semibold">Christian Living</div>
          <p className="mt-2 text-sm text-white/70">
            Practical encouragement for everyday life.
          </p>
        </Link>

        <Link
          href="/resources/favorites"
          className="fc-surface p-6 hover:bg-white/10 transition"
        >
          <div className="text-white font-semibold">Favorites</div>
          <p className="mt-2 text-sm text-white/70">
            Your saved verses, prayers, and devotionals.
          </p>
        </Link>

        <div className="fc-surface p-6">
          <div className="text-white font-semibold">More coming soon</div>
          <p className="mt-2 text-sm text-white/70">
            Guides, reading plans, and study tools.
          </p>
        </div>
      </div>
    </div>
  );
}
