export default function ChristianLivingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Christian Living</h1>

      <p className="text-slate-600 max-w-2xl">
        Simple, practical encouragement for daily life—faith, habits, relationships, and
        walking with God. New articles and resources are coming soon.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold mb-2">Coming next</h2>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
            <li>Short devotionals for everyday moments</li>
            <li>Faith + anxiety / peace / guidance topics</li>
            <li>Printable prayer prompts</li>
            <li>Scripture-based habit builders</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-600">
            Tip: We can later wire this page to your blog/content system so it auto-populates.
          </p>
        </div>
      </div>
    </main>
  );
}
