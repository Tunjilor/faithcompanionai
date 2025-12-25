import BrandHeader from "@/components/BrandHeader";

export default function WrappedPage() {
  return (
    <main className="min-h-screen px-6 py-10 app-bg">
      <div className="max-w-6xl mx-auto">
        <BrandHeader
          title="Wrapped"
          subtitle="A fun recap of your faith journey—streaks, saved verses, prayers, and progress."
        />

        <div className="brand-surface p-8">
          <h2 className="text-xl font-extrabold text-slate-900">Coming soon</h2>
          <p className="text-slate-700 mt-2 max-w-2xl">
            This page will show your “Faith Companion Wrapped” once we connect real user data
            (Supabase Auth + database).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur p-5">
              <div className="text-sm font-semibold text-slate-900">Streak</div>
              <div className="text-3xl font-extrabold mt-2 text-slate-900">—</div>
              <div className="text-sm text-slate-600 mt-1">Days in a row</div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur p-5">
              <div className="text-sm font-semibold text-slate-900">Saved items</div>
              <div className="text-3xl font-extrabold mt-2 text-slate-900">—</div>
              <div className="text-sm text-slate-600 mt-1">Verses + prayers + devotionals</div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur p-5">
              <div className="text-sm font-semibold text-slate-900">Most common topic</div>
              <div className="text-3xl font-extrabold mt-2 text-slate-900">—</div>
              <div className="text-sm text-slate-600 mt-1">From your Ask/Prayer history</div>
            </div>
          </div>

          <div className="mt-8 text-sm text-slate-600">
            Next step: we’ll store activity events (verse views, prayers created, favorites saved)
            and compute these stats automatically.
          </div>
        </div>
      </div>
    </main>
  );
}
