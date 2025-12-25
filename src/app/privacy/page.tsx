export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-4 text-slate-700">
        We keep this simple: we collect only what we need to run the site and improve the experience.
      </p>

      <section className="mt-8 space-y-4 text-slate-700">
        <h2 className="text-xl font-semibold text-slate-900">What we collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Basic usage information (pages visited, performance, errors)</li>
          <li>Info you choose to submit (questions, saved content) when those features are enabled</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900">What we don’t do</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We do not sell your personal information.</li>
          <li>We do not share private content publicly unless you choose to post it (e.g., Prayer Wall).</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
        <p>
          Questions? Use the <a className="underline" href="/contact">contact page</a>.
        </p>
      </section>
    </main>
  );
}
