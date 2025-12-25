export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Contact</h1>
      <p className="mt-4 text-slate-700">
        Need help or have a question? Email us and we’ll get back to you.
      </p>

      <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
        <div className="text-sm text-slate-600">Email</div>
        <div className="mt-1 text-lg font-semibold text-slate-900">
          <a className="underline" href="mailto:support@faithcompanionai.com">
            support@faithcompanionai.com
          </a>
        </div>
        <p className="mt-3 text-sm text-slate-700">
          Please include a short description of what you were trying to do and any error message you saw.
        </p>
      </div>
    </main>
  );
}
