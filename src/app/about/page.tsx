import BrandHeader from "@/components/BrandHeader";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <BrandHeader
        title="About"
        subtitle="Why Faith Companion AI exists — and how it helps your daily walk."
      />

      <div className="fc-surface p-6 space-y-4">
        <p className="text-white/80">
          Faith Companion AI helps you get Scripture references, short prayers, and devotionals — fast.
        </p>

        <p className="text-white/70">
          The goal is simple: make it easier to build consistent time with God using tools that feel
          calm, focused, and mobile-friendly.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-white font-semibold">What’s coming next</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>Saved favorites (verses, prayers, devotionals)</li>
            <li>Guided plans and daily progress tracking</li>
            <li>Premium quizzes and deeper study tools</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
