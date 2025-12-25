"use client";

import React, { useMemo, useState } from "react";

type Topic =
  | "Anxiety / Fear"
  | "Guidance / Decision"
  | "Healing"
  | "Grief / Loss"
  | "Relationships"
  | "Forgiveness"
  | "Purpose"
  | "Faith / Doubt";

type Tone = "Encouraging" | "Gentle" | "Direct" | "Hopeful" | "Comforting";

type OutputStyle = "Headings + short paragraphs" | "Bullet points" | "Short + simple" | "Prayer-first";

type Audience = "Everyday (no jargon)" | "Teen" | "New believer" | "In-depth study";

const TOPICS: Topic[] = [
  "Anxiety / Fear",
  "Guidance / Decision",
  "Healing",
  "Grief / Loss",
  "Relationships",
  "Forgiveness",
  "Purpose",
  "Faith / Doubt",
];

const TONES: Tone[] = ["Encouraging", "Gentle", "Direct", "Hopeful", "Comforting"];
const OUTPUTS: OutputStyle[] = ["Headings + short paragraphs", "Bullet points", "Short + simple", "Prayer-first"];
const AUDIENCES: Audience[] = ["Everyday (no jargon)", "Teen", "New believer", "In-depth study"];

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

function Card({
  title,
  desc,
  cta,
}: {
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/70">{desc}</p>
        </div>
        <span className="rounded-xl bg-white/10 px-2.5 py-1 text-xs text-white/80">New</span>
      </div>
      <button
        className="mt-4 w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/15 active:bg-white/20"
        type="button"
      >
        {cta}
      </button>
    </div>
  );
}

export default function Home() {
  const [question, setQuestion] = useState("need a scripture about anxiety");
  const [topic, setTopic] = useState<Topic>("Guidance / Decision");
  const [tone, setTone] = useState<Tone>("Encouraging");
  const [outputStyle, setOutputStyle] = useState<OutputStyle>("Headings + short paragraphs");
  const [audience, setAudience] = useState<Audience>("Everyday (no jargon)");

  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string>("");

  const canSubmit = useMemo(() => question.trim().length > 3 && !isLoading, [question, isLoading]);

  function clear() {
    setQuestion("");
    setAnswer("");
  }

  // Placeholder: today we simulate output. Next step we’ll replace this with a real OpenAI API route.
  async function getAnswer() {
    setIsLoading(true);
    setAnswer("");

    // small delay to feel “real”
    await new Promise((r) => setTimeout(r, 700));

    const mock = [
      `## Scripture to anchor you`,
      `- **Philippians 4:6–7** — bring your requests to God; His peace will guard your heart and mind.`,
      `- **1 Peter 5:7** — cast your anxieties on Him because He cares for you.`,
      ``,
      `## A simple next step (today)`,
      `Take one worry and turn it into a one-sentence prayer. Then breathe slowly and repeat the verse once.`,
      ``,
      `## Short prayer (${tone})`,
      `Father, I bring You my anxious thoughts. Please steady my mind, guard my heart, and guide my next step. Help me trust You more than my feelings. Amen.`,
      ``,
      `*Topic: ${topic} • Output: ${outputStyle} • Audience: ${audience}*`,
    ].join("\n");

    setAnswer(mock);
    setIsLoading(false);
  }

  function downloadTxt() {
    const content = answer || "No answer yet.";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faith-companion-ai-response.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Top Nav */}
      
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap gap-2">
                <Pill>Scripture + prayer in seconds</Pill>
                <Pill>Mobile-first</Pill>
                <Pill>Save + download (coming)</Pill>
              </div>

              <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                Your daily spiritual companion—<span className="text-orange-300">all in one place</span>.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 md:text-base">
                Ask a question, get Bible references, and receive a short prayer—without having to search all over the internet.
                (We’ll connect this to your OpenAI + Supabase next.)
              </p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <a
                  href="#ask"
                  className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-black hover:opacity-95"
                >
                  Ask the Bible
                </a>
                <a
                  href="#plans"
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
                >
                  Explore guided plans
                </a>
              </div>
            </div>

            <div className="grid w-full gap-3 md:w-[360px]">
              <Card
                title="Daily Verse"
                desc="Fresh verse + reflection each day."
                cta="Open Daily Verse"
              />
              <Card
                title="Prayer Generator"
                desc="Personalized short prayers by topic."
                cta="Create a Prayer"
              />
            </div>
          </div>
        </section>

        {/* Ask the Bible */}
        <section id="ask" className="mt-10">
          <div className="rounded-3xl border border-white/10 bg-black/50 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="w-full md:flex-1">
                <h2 className="text-xl font-semibold">Ask the Bible</h2>
                <p className="mt-1 text-sm text-white/70">
                  Type a question. Get Scripture references + a short prayer.
                </p>

                <label className="mt-4 block text-xs text-white/70">Your question</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={5}
                  placeholder="Example: I feel anxious and can’t sleep. What does the Bible say?"
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/20"
                />

                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={getAnswer}
                    disabled={!canSubmit}
                    className={classNames(
                      "rounded-xl px-5 py-3 text-sm font-semibold",
                      canSubmit
                        ? "bg-white text-black hover:opacity-95"
                        : "bg-white/20 text-white/50 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? "Working..." : "Get Answer"}
                  </button>
                  <button
                    onClick={clear}
                    type="button"
                    className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-white/85">Result</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!answer}
                        className={classNames(
                          "rounded-lg border px-3 py-1.5 text-xs",
                          answer
                            ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
                            : "border-white/10 bg-white/5 text-white/35 cursor-not-allowed"
                        )}
                        onClick={() => {
                          // Placeholder for Supabase save
                          alert("Next step: we’ll save this to Supabase (SavedContent) per user.");
                        }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        disabled={!answer}
                        className={classNames(
                          "rounded-lg border px-3 py-1.5 text-xs",
                          answer
                            ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
                            : "border-white/10 bg-white/5 text-white/35 cursor-not-allowed"
                        )}
                        onClick={downloadTxt}
                      >
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 min-h-[120px] whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
                    {isLoading
                      ? "Generating… (we’ll wire this to OpenAI next)"
                      : answer
                      ? answer
                      : "No answer yet. Ask a question above."}
                  </div>

                  <p className="mt-3 text-xs text-white/50">
                    Note: Today this is a placeholder response. Next we’ll connect your OpenAI key and generate real answers.
                    After that we’ll store conversations per user and support full conversation downloads.
                  </p>
                </div>
              </div>

              {/* Right Controls */}
              <div className="w-full md:w-[320px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-sm font-semibold text-white">Settings</h3>

                  <div className="mt-3 space-y-3">
                    <Select label="Topic" value={topic} setValue={setTopic} options={TOPICS} />
                    <Select label="Tone" value={tone} setValue={setTone} options={TONES} />
                    <Select label="Output style" value={outputStyle} setValue={setOutputStyle} options={OUTPUTS} />
                    <Select label="Audience" value={audience} setValue={setAudience} options={AUDIENCES} />
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/65">
                    <div className="font-medium text-white/80">Coming next</div>
                    <ul className="mt-2 list-disc space-y-1 pl-4">
                      <li>Real OpenAI responses (API route)</li>
                      <li>User accounts (Supabase Auth)</li>
                      <li>Saved conversations (Supabase DB)</li>
                      <li>Download as TXT/PDF</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guided Plans */}
        <section id="plans" className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Guided Plans</h2>
              <p className="mt-1 text-sm text-white/70">
                Structured journeys that help users build daily habits.
              </p>
            </div>
            <button className="hidden rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 md:block">
              See starter plans
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <PlanCard title="7 Days of Peace" desc="Anxiety → calm through daily Scripture + prayer." />
            <PlanCard title="21 Days of Gratitude" desc="Daily prompts to build joy and perspective." />
            <PlanCard title="30 Days in Proverbs" desc="Practical wisdom for everyday decisions." />
          </div>
        </section>

        {/* Footer-ish */}
        <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-white/90 font-semibold">Faith Companion AI</div>
              <div className="mt-1">Built with Next.js + Supabase + Vercel.</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill>Privacy-first</Pill>
              <Pill>Room for expansion</Pill>
              <Pill>Fast + reliable</Pill>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Select<T extends string>({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: T;
  setValue: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <div>
      <label className="block text-xs text-white/60">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value as T)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#07070a]">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function PlanCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/70">{desc}</p>
        </div>
        <span className="rounded-xl bg-white/10 px-2.5 py-1 text-xs text-white/80">Plan</span>
      </div>
      <button className="mt-4 w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/15">
        Open Plan
      </button>
    </div>
  );
}
