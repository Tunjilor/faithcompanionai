import BrandHeader from "@/components/BrandHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <BrandHeader
        title="Dashboard"
        subtitle="Your saved verses, prayers, devotionals, and daily progress."
      />

      <div className="fc-surface p-6">
        <p className="text-white/70">
          Saved prayers, favorites, reading plans — coming next.
        </p>
      </div>
    </div>
  );
}
