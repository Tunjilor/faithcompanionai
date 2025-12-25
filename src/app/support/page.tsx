export default function SupportPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-3xl border border-black/10 bg-white/70 p-8 backdrop-blur">
        <h1 className="text-3xl font-extrabold text-slate-900">Support</h1>
        <p className="mt-3 text-slate-700">
          Faith Companion AI is built to help you grow in faith with daily verses, short prayers, devotionals, and tools.
          This page explains how support works and where to go if you need help.
        </p>

        <h2 className="mt-8 text-xl font-bold text-slate-900">Need help with the app?</h2>
        <p className="mt-2 text-slate-700">
          If something isn’t working (pages not loading, errors, billing questions), please visit{" "}
          <span className="font-semibold">Contact</span> and send a message with:
        </p>
        <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-1">
          <li>What you were trying to do</li>
          <li>The page URL (example: /resources/wrapped)</li>
          <li>Any error message you saw</li>
          <li>Your device/browser (optional but helpful)</li>
        </ul>

        <h2 className="mt-8 text-xl font-bold text-slate-900">Premium & billing</h2>
        <p className="mt-2 text-slate-700">
          If you purchased Premium and have a billing question, we’ll help you sort it out quickly. For refunds, see the{" "}
          <span className="font-semibold">Refund</span> page.
        </p>

        <h2 className="mt-8 text-xl font-bold text-slate-900">Transparency</h2>
        <p className="mt-2 text-slate-700">
          We do not claim to be a charity on this site unless clearly stated. If we ever run a specific fundraiser, we will
          clearly name the beneficiary and how funds are handled.
        </p>
      </div>
    </main>
  );
}
