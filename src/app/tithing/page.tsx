import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "What Is Tithing? Bible Meaning, Verses, and How to Calculate It",
  description:
    "Learn what tithing means in the Bible, the difference between tithe and offering, and how to calculate your giving.",
  alternates: { canonical: "/tithing" },
  openGraph: {
    title: "What Is Tithing? Bible Meaning, Verses, and How to Calculate It",
    description:
      "Learn what tithing means in the Bible, the difference between tithe and offering, and how to calculate your giving.",
    url: "https://faithcompanionai.com/tithing",
    siteName: "Faith Companion AI",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Is Tithing? Bible Meaning, Verses, and How to Calculate It",
    description:
      "Learn what tithing means in the Bible, the difference between tithe and offering, and how to calculate your giving.",
  },
};

const bibleVerses = [
  {
    reference: "Malachi 3:10",
    verse:
      '"Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this," says the Lord Almighty, "and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it."',
    explanation:
      "This is the most cited tithing verse in the Old Testament. God directly invites His people to test His faithfulness through their obedience in giving — a rare and remarkable promise.",
  },
  {
    reference: "Proverbs 3:9",
    verse:
      '"Honor the Lord with your wealth, with the firstfruits of all your crops."',
    explanation:
      "The concept of \"firstfruits\" meant giving from the first and best of what you received, not the leftovers. It reflects a posture of trust — acknowledging that everything comes from God.",
  },
  {
    reference: "Genesis 14:20",
    verse:
      '"And praise be to God Most High, who delivered your enemies into your hand." Then Abram gave him a tenth of everything.',
    explanation:
      "This is one of the earliest recorded tithes in Scripture — Abraham giving a tenth to Melchizedek, the priest of God Most High. It predates the Mosaic Law, showing that the practice of giving a tenth has deep roots.",
  },
  {
    reference: "Leviticus 27:30",
    verse:
      '"A tithe of everything from the land, whether grain from the soil or fruit from the trees, belongs to the Lord; it is holy to the Lord."',
    explanation:
      "Under the Mosaic Law, the tithe was formally established as belonging to God. The language is explicit: it is not a gift from you to God — it already belongs to Him.",
  },
];

const faithTools = [
  {
    name: "Tithe Calculator AI",
    description:
      "Calculate exactly what 10% of your income looks like — gross, net, weekly, monthly, or annual. Fast and free.",
    href: "https://tithecalculatorai.com",
    tag: "Calculate your tithe",
    accent: "text-orange-300",
  },
  {
    name: "Prayer Generator AI",
    description:
      "Generate a personal prayer for your giving journey — whether you are just starting to tithe or deepening your generosity practice.",
    href: "https://prayergeneratorai.com",
    tag: "Personalized prayer",
    accent: "text-purple-300",
  },
  {
    name: "Bible Verse Generator AI",
    description:
      "Get scripture tailored to your specific faith question — including verses on generosity, stewardship, and financial trust.",
    href: "https://bibleversegeneratorai.com",
    tag: "Scripture on demand",
    accent: "text-orange-300",
  },
];

export default function TithingPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-0">

      {/* ── 1. HERO ── */}
      <section
        className="rounded-[32px] p-8 shadow-2xl md:p-12"
        style={{
          background:
            "linear-gradient(135deg, rgba(109,40,217,0.18) 0%, rgba(234,88,12,0.10) 100%)",
          border: "1px solid rgba(139,92,246,0.25)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white/70"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Biblical giving • tithe meaning • how to calculate
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
            What Is Tithing? A Complete Biblical Guide
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Tithing is one of the oldest acts of worship in Scripture. Whether you are
            new to the concept or looking to deepen your understanding, this guide walks
            through what the Bible says, which verses apply, and how to put it into practice.
          </p>

          <div className="mt-8">
            <a
              href="https://tithecalculatorai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Calculate Your Tithe Now →
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/50 sm:text-sm">
            <span>Free calculator</span>
            <span>•</span>
            <span>Gross or net</span>
            <span>•</span>
            <span>Scripture-grounded</span>
          </div>
        </div>
      </section>

      {/* ── 2. WHAT IS TITHING ── */}
      <section
        className="rounded-[30px] p-8 md:p-10"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
          Definition
        </div>
        <h2 className="mt-4 text-2xl font-bold text-white md:text-3xl">
          What Is Tithing?
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-white/75 md:text-base">
          <p>
            The word <em>tithe</em> comes from the Old English <em>teotha</em>, meaning
            &ldquo;tenth.&rdquo; In its simplest definition, tithing is the practice of giving
            10% of your income or increase to God — typically through the local church or
            a ministry. It is an act of worship that acknowledges God as the ultimate source
            of every resource you have.
          </p>
          <p>
            The 10% principle appears throughout the Old Testament as a standard of
            faithful giving. It was not framed as optional generosity but as a foundational
            act of obedience — returning to God what already belongs to Him.
          </p>
          <p>
            The Old Testament roots of tithing go back even before the Mosaic Law. Abraham
            gave a tenth of everything to Melchizedek (Genesis 14:20), and Jacob vowed to
            give a tenth to God at Bethel (Genesis 28:22). By the time the Law was formally
            given, the tithe was codified as a specific obligation for God&apos;s people —
            supporting the Levites, the temple, and those in need.
          </p>
        </div>
      </section>

      {/* ── 3. AD SLOT 1 ── */}
      <div id="ad-slot-1" className="w-full" aria-hidden="true">{/* AdSense Slot 1 */}</div>

      {/* ── 4. BIBLE VERSES ── */}
      <section>
        <div className="mb-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            Scripture
          </div>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            Key Bible Verses on Tithing
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/60">
            These passages form the biblical foundation for the practice of tithing across
            both the Old and New Testament traditions.
          </p>
        </div>

        <div className="space-y-5">
          {bibleVerses.map((verse) => (
            <div
              key={verse.reference}
              className="rounded-[26px] p-6 md:p-8"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="inline-flex rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300">
                {verse.reference}
              </div>
              <blockquote className="mt-4 border-l-2 border-purple-400 pl-4 text-sm italic leading-7 text-white/85 md:text-base">
                {verse.verse}
              </blockquote>
              <p className="mt-4 text-sm leading-7 text-white/65">
                {verse.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. TITHE VS OFFERING ── */}
      <section
        className="rounded-[30px] p-8 md:p-10"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Tithe vs. Offering: What&apos;s the Difference?
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/70">
          These two terms are often used interchangeably, but they are distinct in both
          definition and purpose.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div
            className="rounded-[22px] p-6"
            style={{
              background: "rgba(109,40,217,0.12)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <div className="text-xs font-bold uppercase tracking-wide text-purple-300">
              The Tithe
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-white/75">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                Exactly 10% of your income or increase
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                Considered a baseline obligation in the Old Testament
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                Typically directed to the local church or storehouse
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                Described as &ldquo;holy to the Lord&rdquo; in Leviticus 27:30
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                A fixed, consistent percentage — not circumstantial
              </li>
            </ul>
          </div>

          <div
            className="rounded-[22px] p-6"
            style={{
              background: "rgba(234,88,12,0.10)",
              border: "1px solid rgba(251,146,60,0.2)",
            }}
          >
            <div className="text-xs font-bold uppercase tracking-wide text-orange-300">
              The Offering
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-white/75">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                Any gift given above and beyond the tithe
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                Voluntary — motivated by gratitude or a specific need
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                Can go to missions, charities, or individuals in need
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                No fixed amount — given as led by the Spirit
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                Reflects generosity, not obligation
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-sm leading-7 text-white/60">
          In practice, many Christians tithe first (10%) and then give offerings as they
          feel led — treating the tithe as a floor, not a ceiling, for generosity.
        </p>
      </section>

      {/* ── 6. GROSS OR NET ── */}
      <section
        className="rounded-[30px] p-8 md:p-10"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Should You Tithe on Gross or Net Income?
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/70">
          This is one of the most common practical questions Christians ask. The Bible
          does not spell out gross versus net — so thoughtful believers land in different
          places. Here are both views presented fairly.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div
            className="rounded-[22px] p-6"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-lg font-bold text-white">Tithe on Gross</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Those who tithe on gross income argue that the&nbsp;
              <em>firstfruits</em> principle (Proverbs 3:9) points to giving from your
              total earnings before deductions. The gross amount reflects what God actually
              provided — taxes are simply what is owed to Caesar afterward. Many see this
              as the more generous and faith-forward posture.
            </p>
          </div>

          <div
            className="rounded-[22px] p-6"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-lg font-bold text-white">Tithe on Net</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Those who tithe on net (take-home) pay reason that you can only give from
              what you actually control. You cannot spend the taxes withheld before you
              receive your paycheck, so giving 10% of what you take home is a faithful and
              honest reflection of your available increase. Both views are held by
              sincere, generous believers.
            </p>
          </div>
        </div>

        <div
          className="mt-6 rounded-[20px] p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: "rgba(109,40,217,0.12)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <p className="text-sm leading-7 text-white/80">
            Not sure what 10% of your income looks like? The Tithe Calculator AI handles
            both gross and net — weekly, bi-weekly, monthly, or annual.
          </p>
          <a
            href="https://tithecalculatorai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Try the Calculator →
          </a>
        </div>
      </section>

      {/* ── 7. AD SLOT 2 ── */}
      <div id="ad-slot-2" className="w-full" aria-hidden="true">{/* AdSense Slot 2 */}</div>

      {/* ── 8. DO CHRISTIANS STILL TITHE? ── */}
      <section
        className="rounded-[30px] p-8 md:p-10"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Do Christians Still Tithe Today?
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/70">
          This question touches on the relationship between the Old Testament Law and the
          New Covenant — a topic where faithful theologians hold different views.
        </p>

        <div className="mt-6 space-y-5">
          <div
            className="rounded-[22px] p-6"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-lg font-bold text-white">The Old Testament View</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Under the Mosaic Law, tithing was commanded and specific — a tenth of crops,
              herds, and produce went to support the Levites, the temple, and the poor.
              It was embedded in the covenant life of Israel, tied to land, harvest,
              and the priesthood system.
            </p>
          </div>

          <div
            className="rounded-[22px] p-6"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-lg font-bold text-white">The New Testament Perspective</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              The New Testament does not repeat the tithe as a formal law for believers —
              but it raises the bar on generosity. Paul&apos;s instruction in 2 Corinthians
              reframes giving around the heart, not the percentage:
            </p>
            <blockquote className="mt-4 border-l-2 border-purple-400 pl-4 text-sm italic leading-7 text-white/85">
              &ldquo;Each of you should give what you have decided in your heart to give, not
              reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
              <span className="mt-2 block text-xs not-italic text-purple-300">
                — 2 Corinthians 9:7
              </span>
            </blockquote>
            <p className="mt-4 text-sm leading-7 text-white/70">
              At the same time, Jesus did not dismiss tithing — He affirmed it while
              pointing to something deeper. In Matthew 23:23, He rebuked the Pharisees
              not for tithing but for neglecting what mattered most:
            </p>
            <blockquote className="mt-4 border-l-2 border-orange-400 pl-4 text-sm italic leading-7 text-white/85">
              &ldquo;Woe to you, teachers of the law and Pharisees, you hypocrites! You give
              a tenth of your spices — mint, dill and cumin. But you have neglected the
              more important matters of the law — justice, mercy and faithfulness. You
              should have practiced the latter, without neglecting the former.&rdquo;
              <span className="mt-2 block text-xs not-italic text-orange-300">
                — Matthew 23:23
              </span>
            </blockquote>
          </div>

          <div
            className="rounded-[22px] p-5"
            style={{
              background: "rgba(109,40,217,0.10)",
              border: "1px solid rgba(139,92,246,0.18)",
            }}
          >
            <p className="text-sm leading-7 text-white/75">
              Most Christian traditions today treat tithing as a wise starting point for
              giving — not a legal requirement, but a meaningful, biblical benchmark that
              reflects faithful stewardship and a heart oriented toward God rather than
              money.
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. WHY PEOPLE TITHE ── */}
      <section>
        <div className="mb-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            The practice
          </div>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            Why People Tithe
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/60">
            For most believers, tithing is less about obligation and more about what it
            does to the heart.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              title: "Faith Discipline",
              body: "Tithing is one of the few tangible ways to practice trusting God with something concrete. Writing that check or automating that transfer is an act of belief — that God provides and that His economy works differently than the world's.",
            },
            {
              title: "Generosity Formation",
              body: "Consistently giving trains you away from scarcity thinking. Over time, tithers report that the practice reshapes how they view money entirely — from something to hold tightly to something held loosely.",
            },
            {
              title: "Trust in God's Provision",
              body: "When you tithe, you are not hoping God will cover the gap — you are declaring that He already has. It reframes your finances around sufficiency rather than fear, aligning with Malachi 3:10's promise of overflow.",
            },
            {
              title: "Supporting Ministry",
              body: "The tithe funds the local church — pastors, programs, missions, and outreach. Your giving is part of something larger than a personal spiritual discipline; it is what makes collective ministry possible.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] p-6"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. FAITH TOOLS ── */}
      <section
        className="rounded-[30px] p-8 md:p-10"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            Resources
          </div>
          <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            Faith Tools to Support Your Giving Journey
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/60">
            Practical tools built for believers who want to go beyond reading about faith
            and actually practice it.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {faithTools.map((tool) => (
            <a
              key={tool.name}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-[26px] p-6 transition hover:scale-[1.01]"
              style={{
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                {tool.tag}
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{tool.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-white/65">
                {tool.description}
              </p>
              <div className={`mt-5 text-sm font-semibold ${tool.accent}`}>
                Open tool →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── 11. AD SLOT 3 ── */}
      <div id="ad-slot-3" className="w-full" aria-hidden="true">{/* AdSense Slot 3 */}</div>

      {/* ── 12. FINAL CTA ── */}
      <section
        className="rounded-[32px] p-8 text-center md:p-12"
        style={{
          background:
            "linear-gradient(135deg, rgba(109,40,217,0.22) 0%, rgba(234,88,12,0.14) 100%)",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
            Next step
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white md:text-4xl">
            Grow Beyond the Calculation
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70 md:text-base">
            Tithing is a starting point, not a finish line. If you are ready to build
            a deeper, more consistent faith practice — prayer, scripture, and daily
            devotion are all part of the journey.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95 sm:w-auto"
            >
              Open Faith Dashboard
            </Link>

            <a
              href="https://prayergeneratorai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Generate a Prayer
            </a>

            <a
              href="https://bibleversegeneratorai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Find a Verse
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
