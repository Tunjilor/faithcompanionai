import BrandHeader from "@/components/BrandHeader";

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <BrandHeader
          title="Dashboard"
          subtitle="Your saved verses, prayers, devotionals, and daily progress."
        />
        <p className="text-slate-700">Saved prayers, favorites, reading plans — coming next.</p>
      </div>
    </main>
  );
}
