"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Mode = "trivia" | "speed";
type CategoryId = "general" | "women" | "parables" | "ai" | "theology" | "history";

type Question = {
  q: string;
  options: string[];
  answer: number; // 0-3
};

const DAILY_LIMIT_FREE = 3;

// -----------------------------
// Free (static) question banks
// -----------------------------
const generalQuestions: Question[] = [
  { q: "Who built the ark?", options: ["Noah", "Moses", "Abraham", "David"], answer: 0 },
  { q: "How many books are in the Bible?", options: ["39", "66", "72", "47"], answer: 1 },
  { q: "What is the first book of the New Testament?", options: ["Luke", "Acts", "Matthew", "John"], answer: 2 },
  { q: "Who was swallowed by a great fish?", options: ["Jonah", "Peter", "Paul", "Elijah"], answer: 0 },
  { q: "Who killed Goliath?", options: ["Saul", "David", "Jonathan", "Samuel"], answer: 1 },
  { q: "How many disciples did Jesus have?", options: ["10", "11", "12", "14"], answer: 2 },
  { q: "What is the shortest verse in the Bible?", options: ["God is love", "Jesus wept", "Pray always", "Be still"], answer: 1 },
  { q: "Who was thrown into the lion's den?", options: ["David", "Daniel", "Elijah", "Jeremiah"], answer: 1 },
  { q: "What sea did Moses part?", options: ["Dead Sea", "Sea of Galilee", "Red Sea", "Mediterranean"], answer: 2 },
  { q: "What garden did Jesus pray in before his arrest?", options: ["Eden", "Gethsemane", "Bethany", "Solomon's Garden"], answer: 1 },
  { q: "Who betrayed Jesus for 30 pieces of silver?", options: ["Peter", "Judas", "Thomas", "James"], answer: 1 },
  { q: "What river was Jesus baptized in?", options: ["Nile", "Euphrates", "Jordan", "Tigris"], answer: 2 },
];

const womenOfBibleQuestions: Question[] = [
  { q: "Who was the mother of Samuel?", options: ["Hannah", "Deborah", "Ruth", "Esther"], answer: 0 },
  { q: "Who was the first woman?", options: ["Sarah", "Eve", "Mary", "Ruth"], answer: 1 },
  { q: "Who became queen of Persia and helped save her people?", options: ["Ruth", "Esther", "Miriam", "Anna"], answer: 1 },
  { q: "Who was Abraham’s wife?", options: ["Rachel", "Leah", "Sarah", "Rebekah"], answer: 2 },
  { q: "Who showed loyalty to Naomi and said, 'Your people shall be my people'?", options: ["Mary", "Ruth", "Martha", "Hagar"], answer: 1 },
  { q: "Who was Moses’ sister who watched over him as a baby?", options: ["Deborah", "Miriam", "Jael", "Elizabeth"], answer: 1 },
  { q: "Who was the judge and prophetess of Israel?", options: ["Deborah", "Esther", "Rahab", "Phoebe"], answer: 0 },
  { q: "Who hid the spies in Jericho?", options: ["Jael", "Rahab", "Naomi", "Priscilla"], answer: 1 },
  { q: "Who was the mother of Jesus?", options: ["Elizabeth", "Mary", "Martha", "Ruth"], answer: 1 },
  { q: "Who sat at Jesus’ feet and listened to His teaching?", options: ["Martha", "Mary of Bethany", "Esther", "Deborah"], answer: 1 },
  { q: "Who was the first person recorded to see the risen Jesus?", options: ["Mary Magdalene", "Martha", "Priscilla", "Anna"], answer: 0 },
  { q: "Who was the wife of Isaac?", options: ["Rebekah", "Sarah", "Leah", "Rachel"], answer: 0 },
];

const parablesQuestions: Question[] = [
  { q: "In the parable of the sower, where did the seed that produced the best crop fall?", options: ["On the path", "Rocky ground", "Among thorns", "Good soil"], answer: 3 },
  { q: "In the parable of the Good Samaritan, who helped the injured man?", options: ["A priest", "A Levite", "A Samaritan", "An innkeeper"], answer: 2 },
  { q: "In the parable of the Prodigal Son, what did the father do when the son returned?", options: ["Rejected him", "Punished him", "Welcomed and celebrated", "Ignored him"], answer: 2 },
  { q: "In the parable of the Lost Sheep, how many sheep were in the flock?", options: ["10", "50", "99", "100"], answer: 3 },
  { q: "In the parable of the Mustard Seed, what does the mustard seed become?", options: ["A vine", "A large tree", "A flower", "A shrub only"], answer: 1 },
  { q: "In the parable of the Talents, what happened to the servant who hid his talent?", options: ["He was praised", "He was ignored", "He was rebuked and lost it", "He was promoted"], answer: 2 },
  { q: "In the parable of the Wise and Foolish Builders, what was the difference?", options: ["The size of the house", "The location of the house", "The foundation", "The color of the house"], answer: 2 },
  { q: "In the parable of the Pharisee and the Tax Collector, who went home justified?", options: ["The Pharisee", "The tax collector", "Both", "Neither"], answer: 1 },
  { q: "In the parable of the Wedding Banquet, what did a guest need to have?", options: ["Money", "A wedding garment", "A crown", "A passport"], answer: 1 },
  { q: "In the parable of the Wheat and the Tares, what was allowed to grow together until harvest?", options: ["Wheat and tares", "Grapes and thorns", "Olives and weeds", "Fig trees and briars"], answer: 0 },
];

function pickRandom<T>(arr: T[], n: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// -----------------------------
// Daily usage (free) tracker
// -----------------------------
function getDailyCount() {
  if (typeof window === "undefined") return 0;
  const today = new Date().toLocaleDateString();
  const raw = localStorage.getItem("quiz_daily");
  const data = raw ? JSON.parse(raw) : {};
  if (data.date !== today) {
    localStorage.setItem("quiz_daily", JSON.stringify({ date: today, count: 0 }));
    return 0;
  }
  return Number(data.count || 0);
}

function incrementDailyCount() {
  const today = new Date().toLocaleDateString();
  const raw = localStorage.getItem("quiz_daily");
  const data = raw ? JSON.parse(raw) : {};
  const next = { date: today, count: Number(data.count || 0) + 1 };
  localStorage.setItem("quiz_daily", JSON.stringify(next));
  return next.count;
}

// -----------------------------
// API fetch for premium packs
// -----------------------------
async function fetchGenerated(category: CategoryId, count: number): Promise<Question[]> {
  const res = await fetch(
    `/api/quiz/generate?category=${encodeURIComponent(category)}&count=${count}`,
    { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store" }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const qs: any[] = Array.isArray(data?.questions) ? data.questions : [];

  const cleaned: Question[] = qs
    .map((q) => ({
      q: String(q?.q || "").slice(0, 180),
      options: Array.isArray(q?.options) ? q.options.map((x: any) => String(x).slice(0, 80)).slice(0, 4) : [],
      answer: Number(q?.answer),
    }))
    .filter((q) => q.q && q.options.length === 4 && q.answer >= 0 && q.answer <= 3);

  return cleaned.slice(0, count);
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function badgeForScore(score: number, total: number) {
  const pct = total ? score / total : 0;
  if (pct >= 0.9) return { label: "🏆 Scripture Scholar" };
  if (pct >= 0.7) return { label: "⭐ Strong Faith" };
  return { label: "📖 Keep Growing" };
}

const categories: Array<{ id: CategoryId; name: string; premium: boolean }> = [
  { id: "general", name: "General Bible Knowledge", premium: false },
  { id: "women", name: "Women of the Bible", premium: false },
  { id: "parables", name: "Jesus’ Parables", premium: false },
  { id: "ai", name: "AI Bible Questions", premium: true },
  { id: "theology", name: "Theology", premium: true },
  { id: "history", name: "Church History", premium: true },
];

export default function QuizClient() {
  const [mode, setMode] = useState<Mode>("trivia");
  const [category, setCategory] = useState<CategoryId>("general");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);

  const [showPremium, setShowPremium] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);

  const [toast, setToast] = useState<string | null>(null);

  const [premium, setPremium] = useState(false);
  const [premiumLoaded, setPremiumLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setPremium(!!d?.premium))
      .catch(() => setPremium(false))
      .finally(() => setPremiumLoaded(true));
  }, []);

  useEffect(() => setDailyCount(getDailyCount()), []);

  // Speed round timer
  useEffect(() => {
    if (!started || finished || mode !== "speed") return;
    if (timer <= 0) {
      endQuiz();
      return;
    }
    const t = window.setInterval(() => setTimer((v) => v - 1), 1000);
    return () => window.clearInterval(t);
  }, [started, finished, mode, timer]);

  // Tiny toast auto-hide
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  function resetRun() {
    setQuestions([]);
    setIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setFinished(false);
    setLoading(false);
    setTimer(mode === "speed" ? (premium ? 90 : 45) : 45);
  }

  async function startQuiz() {
    if (!premium) {
      const current = getDailyCount();
      if (current >= DAILY_LIMIT_FREE) {
        setShowPremium(true);
        return;
      }
      incrementDailyCount();
      setDailyCount(getDailyCount());
    }

    resetRun();
    setStarted(true);
    setLoading(true);

    try {
      let qs: Question[] = [];

      if (category === "general") qs = pickRandom(generalQuestions, 10);
      if (category === "women") qs = pickRandom(womenOfBibleQuestions, 10);
      if (category === "parables") qs = pickRandom(parablesQuestions, 10);

      if (category === "ai" || category === "theology" || category === "history") {
        if (!premium) {
          setShowPremium(true);
          setStarted(false);
          return;
        }
        const generated = await fetchGenerated(category, 10);
        qs = generated.length ? generated : pickRandom(generalQuestions, 10);
      }

      setQuestions(qs);
      setIndex(0);
    } finally {
      setLoading(false);
    }
  }

  async function continuePlusTen() {
    if (!premium) return;
    if (!(category === "ai" || category === "theology" || category === "history")) return;

    setLoading(true);
    try {
      const more = await fetchGenerated(category, 10);
      setQuestions((prev) => [...prev, ...(more.length ? more : pickRandom(generalQuestions, 10))]);
      setToast("Added 10 more questions ✅");
    } finally {
      setLoading(false);
    }
  }

  function endQuiz() {
    setStarted(false);
    setFinished(true);
  }

  function answer(i: number) {
    if (!questions[index]) return;

    const correct = questions[index].answer === i;
    if (correct) setScore((s) => s + 1);
    setTotalAnswered((t) => t + 1);

    const nextIndex = index + 1;
    if (nextIndex < questions.length) setIndex(nextIndex);
    else endQuiz();
  }

  function playAgainSame() {
    setStarted(false);
    setFinished(false);
    setQuestions([]);
    startQuiz();
  }

  function backToCategorySelect() {
    setStarted(false);
    setFinished(false);
    setQuestions([]);
    resetRun();
  }

  const shareUrl =
    typeof window !== "undefined" ? window.location.origin + "/biblequiz" : "https://faithcompanionai.com/biblequiz";

  const shareText = `I scored ${score}/${Math.max(totalAnswered, 0)} on the Faith Companion AI Bible Quiz (${
    categories.find((c) => c.id === category)?.name
  }). Can you beat me?`;

  async function copyScore() {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setToast("Copied! ✅");
    } catch {
      setToast("Copy failed — try again");
    }
  }

  async function nativeShare() {
    try {
      if (!("share" in navigator)) {
        setToast("Share not available on this device");
        return;
      }
      // @ts-ignore
      await navigator.share({ title: "Faith Companion AI — Bible Quiz", text: shareText, url: shareUrl });
    } catch {
      // user cancelled
    }
  }

  const hero = (
    <section className="rounded-3xl bg-gradient-to-r from-purple-600 to-orange-500 p-[1px]">
      <div className="rounded-3xl bg-black/35 px-6 py-10 text-center backdrop-blur">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Bible Quiz</h1>
        <p className="mt-2 text-white/80">Test your Scripture knowledge</p>
      </div>
    </section>
  );

  const statusLabel = useMemo(() => {
    if (!premiumLoaded) return "Checking…";
    return premium ? "Premium active ✅" : "Free plan";
  }, [premiumLoaded, premium]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {hero}

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      {/* Mode + Start */}
      <div className="fc-surface rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMode("trivia");
                if (!started) resetRun();
              }}
              className={classNames(
                "rounded-md px-5 py-2 text-sm font-semibold transition",
                mode === "trivia" ? "bg-purple-600 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
              )}
            >
              Trivia
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("speed");
                if (!started) resetRun();
              }}
              className={classNames(
                "rounded-md px-5 py-2 text-sm font-semibold transition",
                mode === "speed" ? "bg-black text-white" : "bg-white/5 text-white/80 hover:bg-white/10"
              )}
            >
              Speed Round
            </button>
          </div>

          <button
            type="button"
            onClick={startQuiz}
            disabled={loading || !premiumLoaded}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:opacity-95 disabled:opacity-60"
          >
            {!premiumLoaded ? "Checking…" : loading ? "Loading…" : started ? "Restart" : "Start Quiz"}
          </button>
        </div>

        <div className="mt-3 flex flex-col items-center justify-center gap-2 text-center">
          {mode === "speed" && started && !finished ? (
            <div className="text-white/80">
              Time Left: <span className="font-bold text-white">{timer}s</span>
            </div>
          ) : null}

          <div className="text-xs text-white/50">{statusLabel}</div>

          {!premium ? (
            <div className="text-xs text-white/50">
              Free daily quizzes:{" "}
              <span className="text-white/70">{Math.max(0, DAILY_LIMIT_FREE - dailyCount)}</span> remaining today
            </div>
          ) : null}
        </div>
      </div>

      {/* Category selector */}
      {!started && !finished ? (
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {categories.map((c) => {
              const active = c.id === category;
              const locked = c.premium && !premium;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    if (locked) setShowPremium(true);
                    else setCategory(c.id);
                  }}
                  className={classNames(
                    "fc-surface flex items-center justify-center rounded-xl border p-4 text-center transition",
                    active ? "border-purple-500" : "border-white/10",
                    locked ? "opacity-75" : "hover:border-white/20"
                  )}
                >
                  <span className={classNames("font-semibold", c.premium ? "text-orange-300" : "text-white")}>
                    {c.name}
                    {c.premium ? " (Premium)" : ""}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-center text-xs text-white/40">
            Tip: Speed Round is more fun on mobile — quick taps, quick answers.
          </div>
        </section>
      ) : null}

      {/* Premium modal */}
      {showPremium ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-black/80 p-6 text-center backdrop-blur">
            <div className="text-2xl font-extrabold text-white">🔒 Premium Category</div>
            <p className="mt-3 text-white/70">
              Upgrade to unlock AI-generated quiz packs (and the “Continue (+10)” endless mode).
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setShowPremium(false)}
                className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
              >
                Not now
              </button>
              <Link
                href="/pricing"
                className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                View Pricing
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/45">Free users get {DAILY_LIMIT_FREE} quizzes/day.</p>
          </div>
        </div>
      ) : null}

      {/* Quiz body */}
      {started && !finished ? (
        <section className="space-y-5">
          <div className="fc-surface rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-white/80 text-sm">
                Category:{" "}
                <span className="text-white font-semibold">{categories.find((c) => c.id === category)?.name}</span>
              </div>
              <div className="text-white/80 text-sm">
                Score: <span className="text-white font-semibold">{score}</span>{" "}
                <span className="text-white/40">/ {Math.max(totalAnswered, 0)} answered</span>
              </div>
            </div>

            <div className="mt-5 text-center">
              <div className="text-lg sm:text-xl font-semibold text-white">{questions[index]?.q}</div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3">
              {questions[index]?.options?.map((op, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => answer(i)}
                  disabled={loading}
                  className="rounded-xl border border-purple-500/60 bg-white text-black px-4 py-3 text-sm sm:text-base font-semibold hover:bg-purple-50 disabled:opacity-60"
                >
                  {op}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-white/45">
                Question <span className="text-white/70">{index + 1}</span> of{" "}
                <span className="text-white/70">{questions.length}</span>
              </div>

              {premium && (category === "ai" || category === "theology" || category === "history") ? (
                <button
                  type="button"
                  onClick={continuePlusTen}
                  disabled={loading}
                  className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-60"
                >
                  {loading ? "Adding…" : "Continue (+10)"}
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* End screen */}
      {!started && finished ? (
        <section className="space-y-5">
          <div className="fc-surface rounded-2xl p-6 sm:p-8 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">Quiz Complete</div>
            <p className="mt-2 text-white/70">
              You scored{" "}
              <span className="text-white font-bold">
                {score}/{Math.max(totalAnswered, 0)}
              </span>
              .
            </p>

            <div className="mt-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold bg-white/10 text-white">
              {badgeForScore(score, Math.max(totalAnswered, 0)).label}
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-sm font-semibold text-white">Share your score</div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={copyScore}
                  className="rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white"
                >
                  Copy score + link
                </button>

                <button
                  type="button"
                  onClick={nativeShare}
                  className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
                >
                  Share…
                </button>
              </div>

              <div className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/60">
                <div className="truncate">{shareText}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={playAgainSame}
                className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Play Again
              </button>

              <button
                type="button"
                onClick={backToCategorySelect}
                className="rounded-md border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white"
              >
                Change Category
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
