import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bible Verses for Anxiety",
  description:
    "7 powerful Bible verses for anxiety and worry. Scripture-based encouragement for when fear feels overwhelming — plus a tool to get a personalized verse for your situation.",
  alternates: { canonical: "/bible-verse-for-anxiety" },
  openGraph: {
    title: "Bible Verses for Anxiety | Faith Companion AI",
    description:
      "Find peace through Scripture. 7 Bible verses for anxiety with reflection — plus get a personalized verse for exactly what you are going through.",
    url: "https://faithcompanionai.com/bible-verse-for-anxiety",
  },
};

const VERSES = [
  {
    reference: "Philippians 4:6–7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    reflection:
      "This verse does not tell you to stop feeling anxious — it tells you what to do with it. Bring it to God. Every specific worry, every unnamed fear. The promise is not that your circumstances will change, but that a peace that defies logic will stand guard over your heart.",
  },
  {
    reference: "Matthew 6:34",
    text: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.",
    reflection:
      "Anxiety often lives in the future — in the what-ifs and worst-cases that have not happened yet. Jesus redirects us to today. Not because tomorrow does not matter, but because today is the only place where God's grace is actually available to you.",
  },
  {
    reference: "Isaiah 41:10",
    text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
    reflection:
      "The command not to fear comes with a reason: God is with you. Not watching from a distance — with you. This is not a call to suppress your emotions but to anchor them in the presence of someone who is stronger than what you are facing.",
  },
  {
    reference: "1 Peter 5:7",
    text: "Cast all your anxiety on him because he cares for you.",
    reflection:
      "The word &ldquo;cast&rdquo; is active — it is something you do, not something that happens to you. And the reason is personal: not because God is obligated to help, but because He genuinely cares about what you are carrying. You are not burdening Him by bringing your anxiety to Him.",
  },
  {
    reference: "Psalm 34:18",
    text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    reflection:
      "When anxiety builds into something that feels like it is breaking you, this is the verse to return to. God does not withdraw from pain — He draws near to it. The closer you are to breaking, the closer He is to you.",
  },
  {
    reference: "2 Timothy 1:7",
    text: "For God has not given us a spirit of fear, but of power, love and self-discipline.",
    reflection:
      "Anxiety can feel like a defining part of who you are. This verse challenges that. The spirit of fear is not from God — power, love, and a sound mind are. That distinction matters. What feels like your identity may actually be something you have the authority to resist.",
  },
  {
    reference: "John 14:27",
    text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    reflection:
      "The peace Jesus offers is different in kind, not just degree. The world offers peace through resolved circumstances — when the problem goes away. Jesus offers peace that coexists with the problem, rooted in His presence rather than your situation.",
  },
];

export default function BibleVerseForAnxietyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">

      <div className="text-center">
        <div className="inline-flex rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
          Scripture for difficult moments
        </div>
        <h1 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">
          Bible Verses for Anxiety
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base md:leading-8">
          Anxiety is one of the most common struggles among believers and non-believers alike. Scripture
          does not dismiss it — it meets it. These verses are not platitudes. They are anchors.
        </p>
      </div>

      <section className="mt-12 space-y-8">
        {VERSES.map((v, i) => (
          <div
            key={v.reference}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-orange-500 text-xs font-extrabold text-white">
                {i + 1}
              </span>
              <div className="font-semibold text-orange-300">{v.reference}</div>
            </div>
            <blockquote
              className="mt-4 border-l-2 border-purple-500 pl-4 text-sm italic leading-7 text-white/85"
              dangerouslySetInnerHTML={{ __html: `&ldquo;${v.text}&rdquo;` }}
            />
            <p
              className="mt-4 text-sm leading-7 text-white/65"
              dangerouslySetInnerHTML={{ __html: v.reflection }}
            />
          </div>
        ))}
      </section>

      <section
        className="mt-12 rounded-3xl p-8"
        style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(234,88,12,0.12) 100%)", border: "1px solid rgba(139,92,246,0.3)" }}
      >
        <h2 className="text-xl font-extrabold text-white">Need a verse for your specific situation?</h2>
        <p className="mt-3 text-sm leading-7 text-white/65">
          These verses are for everyone. But God&apos;s Word also speaks to the specific anxiety you are
          carrying today. Tell Faith Companion AI what you are going through and receive a verse written
          for your moment — not a general one, but the right one.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/tools/verse"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-7 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Get a Personalized Verse
          </Link>
          <Link
            href="/tools/prayer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Generate a Prayer for Anxiety
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-white">What does the Bible say about anxiety?</h2>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
          The Bible acknowledges anxiety as a real human experience. From the Psalms — full of honest
          expressions of fear and despair — to Paul writing from prison, Scripture does not pretend
          that fear does not exist. What it consistently offers is not the removal of anxiety, but a
          different foundation to stand on while it is present.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
          The consistent invitation is this: bring your anxiety to God rather than carry it alone. Prayer
          is not a technique for managing stress — it is a relationship in which your fears meet a God
          who is already aware of them and already at work.
        </p>
        <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">
          If anxiety is persistent or severe, Scripture is one part of a full response that may also
          include counselling, community, and professional care. Faith and practical help are not opposites.
        </p>
      </section>

    </main>
  );
}
