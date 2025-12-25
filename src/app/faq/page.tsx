export default function FAQPage() {
  const faqs = [
    {
      q: "Is Faith Companion AI free?",
      a: "Yes. You can use core features for free. Premium unlocks extra limits and upcoming features.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. You can cancel your subscription at any time through your PayPal account. Your access stays active until the end of the billing period.",
    },
    {
      q: "Do you offer refunds?",
      a: "If something goes wrong or you were charged unexpectedly, contact us and we’ll help make it right.",
    },
    {
      q: "Is this a church or ministry?",
      a: "Faith Companion AI is a faith-based tool designed to support Scripture reading and daily habits. It’s not a substitute for pastoral care or medical advice.",
    },
    {
      q: "How do I get support?",
      a: "Use the Contact page (or the Support link once added) and we’ll respond as soon as possible.",
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">FAQ</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Quick answers to common questions about Faith Companion AI.
        </p>
      </header>

      <div className="space-y-4">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <summary className="cursor-pointer text-base font-semibold text-slate-900">
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{item.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
