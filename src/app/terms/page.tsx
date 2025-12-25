export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Terms of Use</h1>
      <p className="mt-4 text-slate-700">
        By using Faith Companion AI, you agree to use the site respectfully and responsibly.
      </p>

      <section className="mt-8 space-y-4 text-slate-700">
        <h2 className="text-xl font-semibold text-slate-900">General</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>This site provides faith tools and content for encouragement and learning.</li>
          <li>Content is provided “as is” without warranties.</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900">Community guidelines</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>No harassment, hate, or harmful content.</li>
          <li>Prayer Wall posts should be respectful and considerate.</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900">Changes</h2>
        <p>We may update these terms as the product evolves.</p>
      </section>
    </main>
  );
}
