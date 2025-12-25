export default function RefundPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Refund Policy</h1>
      <p className="mt-4 text-slate-700">
        If you ever offer paid plans, this page explains how refunds work. (You can update the details when payments go live.)
      </p>

      <section className="mt-8 space-y-4 text-slate-700">
        <h2 className="text-xl font-semibold text-slate-900">When paid plans are enabled</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Refund requests are reviewed case-by-case.</li>
          <li>If you were charged in error, we’ll make it right.</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
        <p>
          For billing questions, use the <a className="underline" href="/contact">contact page</a>.
        </p>
      </section>
    </main>
  );
}
