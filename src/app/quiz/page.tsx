// src/app/quiz/page.tsx
"use client";
import { useUser } from "@/context/UserContext";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Choice = "A" | "B" | "C" | "D";
type CategoryId =
  | "general"
  | "women"
  | "parables"
  | "ai"
  | "theology"
  | "history";

type QuizQuestion = {
  id: string;
  category: string;
  prompt: string;
  choices: Record<Choice, string>;
  chosen?: Choice | null;
};

type ReviewItem = {
  questionId: string;
  prompt: string;
  category: string;
  chosen: Choice | null;
  correctAnswer: Choice;
  isCorrect: boolean;
  explanation: string | null;
  choices: Record<Choice, string>;
};

type MeResponse = {
  premium?: boolean;
  isPremium?: boolean;
  authed?: boolean;
  signedIn?: boolean;
  email?: string | null;
  guestName?: string | null;
  displayName?: string | null;
  guest?: {
    isWithinTrial?: boolean;
    daysSinceFirstSeen?: number;
    trial?: {
      isWithinTrial?: boolean;
      daysSinceFirstSeen?: number;
    };
  } | null;
};

type StartQuizResponse = {
  ok?: boolean;
  attemptId?: string;
  category?: CategoryId;
  timed?: boolean;
  questions?: QuizQuestion[];
  isPremium?: boolean;
  usage?: {
    todayUsedQuestions: number;
    todayLimitQuestions: number;
    totalUsedQuestions: number;
    totalLimitQuestions: number;
    daysUsed: number;
    daysLimit: number;
  } | null;
  error?: string;
  message?: string;
  upgradePrompt?: boolean;
  existingCategory?: string;
};

type SubmitQuizResponse = {
  ok?: boolean;
  attemptId?: string;
  shareId?: string;
  score?: number;
  total?: number;
  premiumExplanationsIncluded?: boolean;
  review?: ReviewItem[];
  share?: {
    shareText: string;
    challengeUrl: string;
    x: string;
    facebook: string;
    whatsapp: string;
  };
  redirectTo?: string;
  error?: string;
};

const CATEGORIES: Array<{
  id: CategoryId;
  title: string;
  premium: boolean;
  description: string;
}> = [
  {
    id: "general",
    title: "General Bible Knowledge",
    premium: false,
    description: "Core Scripture knowledge for all levels.",
  },
  {
    id: "women",
    title: "Women of the Bible",
    premium: false,
    description: "Stories, lessons, and key figures.",
  },
  {
    id: "parables",
    title: "Jesus’ Parables",
    premium: false,
    description: "Teachings and meaning behind the parables.",
  },
  {
    id: "ai",
    title: "AI Bible Questions",
    premium: true,
    description: "Premium AI-assisted category.",
  },
  {
    id: "theology",
    title: "Theology",
    premium: true,
    description: "Doctrine, meaning, and deeper understanding.",
  },
  {
    id: "history",
    title: "Church History",
    premium: true,
    description: "Important moments across Christian history.",
  },
];

function isPremiumActive(me: MeResponse | null) {
  return !!(me?.premium ?? me?.isPremium);
}

function getTrialDaysSinceFirstSeen(me: MeResponse | null) {
  const guest = me?.guest;
  if (!guest) return null;

  if (typeof guest.daysSinceFirstSeen === "number") {
    return guest.daysSinceFirstSeen;
  }

  if (typeof guest.trial?.daysSinceFirstSeen === "number") {
    return guest.trial.daysSinceFirstSeen;
  }

  return null;
}

export default function QuizPage() {
  const [loading, setLoading] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, Choice>>({});
  const [error, setError] = useState<string | null>(null);
  const [upgradePrompt, setUpgradePrompt] = useState(false);
  const [usage, setUsage] = useState<StartQuizResponse["usage"]>(null);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [share, setShare] = useState<SubmitQuizResponse["share"] | null>(null);

  const [me, setMe] = useState<MeResponse | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);

  const premiumActive = isPremiumActive(me);
  const displayName =
    me?.displayName || me?.guestName || me?.email?.split("@")[0] || "Faith Friend";

  const canSubmit = useMemo(() => {
    if (!attemptId) return false;
    if (questions.length === 0) return false;
    return questions.every((q) => !!answers[q.id]);
  }, [attemptId, questions, answers]);

  async function loadMe() {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const json = (await res.json()) as MeResponse;
      setMe(json);
      setNameDraft(json?.displayName || json?.guestName || "");
    } catch {
      setMe(null);
    }
  }

  async function saveName() {
    const next = nameDraft.trim();
    if (!next) return;

    setSavingName(true);
    setError(null);

    try {
      const res = await fetch("/api/guest/name", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: next }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        setError("That name isn’t allowed. Try letters and numbers only.");
        return;
      }

      await loadMe();
    } catch {
      setError("Could not save name.");
    } finally {
      setSavingName(false);
    }
  }

  async function startQuiz(category: CategoryId) {
    setLoading(true);
    setError(null);
    setUpgradePrompt(false);
    setResult(null);
    setReview([]);
    setShare(null);
    setAttemptId(null);
    setQuestions([]);
    setAnswers({});
    setSelectedCategory(category);

    try {
      const res = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      const data = (await res.json()) as StartQuizResponse;
      setUsage(data.usage ?? null);

      if (!res.ok || !data.ok) {
        setUpgradePrompt(!!data.upgradePrompt);

        if (data.error === "daily_limit_reached") {
          setError(
            data.message ||
              "You’ve already used your 10 free questions today. Upgrade to Premium or come back tomorrow."
          );
        } else if (data.error === "trial_limit_reached") {
          setError(
            data.message ||
              "You’ve used all 30 free questions across 3 days. Upgrade to Premium to continue."
          );
        } else if (data.error === "premium_required") {
          setError(data.message || "That category is available on Premium.");
        } else if (data.error === "signin_required") {
          setError(data.message || "Please sign in to continue.");
        } else if (data.error === "no_more_free_questions") {
          setError(
            data.message ||
              "No more new questions are available in this category without repeats."
          );
        } else {
          setError(data.message || "Unable to start quiz.");
        }

        return;
      }

      setAttemptId(data.attemptId || null);
      setQuestions(data.questions || []);
    } catch {
      setError("Unable to start quiz.");
    } finally {
      setLoading(false);
    }
  }

  async function submitQuiz() {
    if (!attemptId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, answers }),
      });

      const data = (await res.json()) as SubmitQuizResponse;

      if (!res.ok || !data.ok) {
        setError(data.error || "Submit failed.");
        return;
      }

      setResult({
        score: data.score || 0,
        total: data.total || questions.length || 10,
      });
      setReview(data.review || []);
      setShare(data.share || null);
    } catch {
      setError("Submit failed.");
    } finally {
      setLoading(false);
    }
  }

  async function copyChallengeLink() {
    if (!share?.challengeUrl) return;

    try {
      await navigator.clipboard.writeText(share.challengeUrl);
      setError("Challenge link copied ✅ Share it with friends!");
      setTimeout(() => setError(null), 2500);
    } catch {
      setError("Couldn’t copy the challenge link.");
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  const trialDaysSinceFirstSeen = getTrialDaysSinceFirstSeen(me);
  const trialNote =
    !me?.authed && !me?.signedIn && typeof trialDaysSinceFirstSeen === "number"
      ? `Guest mode • Day ${Math.min(Math.floor(trialDaysSinceFirstSeen) + 1, 3)} of 3`
      : null;

  const scoreTone = useMemo(() => {
    if (!result) return "neutral";
    const pct = result.total > 0 ? result.score / result.total : 0;
    if (pct >= 0.8) return "great";
    if (pct >= 0.5) return "good";
    return "keep-going";
  }, [result]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-white md:text-4xl">Bible Quiz</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 md:text-base">
              Test your Bible knowledge, challenge your friends, and unlock deeper explanations with Premium.
            </p>

            <div className="mt-3 text-sm text-white/75">
              Playing as{" "}
              <span className="font-semibold text-white">{displayName}</span>
              {trialNote ? <span className="ml-2 text-white/50">({trialNote})</span> : null}
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="min-h-[44px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
                placeholder="Change your display name"
              />
              <button
                onClick={saveName}
                disabled={savingName || !nameDraft.trim()}
                className="min-h-[44px] rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-60"
              >
                {savingName ? "Saving..." : "Save name"}
              </button>

              {!me?.authed && !me?.signedIn ? (
                <Link
                  className="min-h-[44px] rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
                  href={`/login?redirect=${encodeURIComponent("/quiz")}`}
                >
                  Sign in
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
              {premiumActive ? "Premium active ✅" : "Free plan"}
            </div>

            <button
              onClick={() => {
                setAttemptId(null);
                setQuestions([]);
                setAnswers({});
                setResult(null);
                setReview([]);
                setShare(null);
                setError(null);
                setUpgradePrompt(false);
              }}
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
            >
              Restart
            </button>
          </div>
        </div>
      </section>

      {usage && !premiumActive && (
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          <div className="font-semibold text-white">Free quiz usage</div>
          <div className="mt-2">Today: {usage.todayUsedQuestions} / {usage.todayLimitQuestions} questions</div>
          <div className="mt-1">Total: {usage.totalUsedQuestions} / {usage.totalLimitQuestions} questions</div>
          <div className="mt-1">Days used: {usage.daysUsed} / {usage.daysLimit}</div>
        </section>
      )}

      {error && (
        <section className="mt-6 rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </section>
      )}

      {upgradePrompt && !premiumActive && (
        <section className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5">
          <h2 className="text-lg font-semibold text-white">
            Upgrade to continue your quiz journey
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/80">
            Free users get 10 questions per day total, 30 questions total across 3 non-consecutive days, with no repeated free questions.
          </p>
          <div className="mt-4">
            <Link
              href="/pricing"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white"
            >
              Upgrade to Monthly
            </Link>
          </div>
        </section>
      )}

      {!attemptId && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white">Choose a category</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const locked = cat.premium && !premiumActive;
              const active = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => startQuiz(cat.id)}
                  disabled={loading}
                  className={`rounded-2xl border p-5 text-left transition ${
                    active
                      ? "border-white/40 bg-white/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  } ${loading ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-white">{cat.title}</div>
                      <div className="mt-2 text-sm leading-6 text-white/70">{cat.description}</div>
                    </div>
                    {locked ? (
                      <span className="rounded-full bg-amber-400/15 px-2 py-1 text-xs font-semibold text-amber-200">
                        Premium
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 text-sm font-medium text-white/80">
                    {loading && active ? "Loading..." : "Start 10-question quiz"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {attemptId && questions.length > 0 && !result && (
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">
              {selectedCategory ? CATEGORIES.find((c) => c.id === selectedCategory)?.title : "Quiz"}
            </h2>
            <div className="text-sm text-white/60">
              Answer all {questions.length} questions
            </div>
          </div>

          <div className="space-y-5">
            {questions.map((q, idx) => (
              <article
                key={q.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
              >
                <div className="mb-3 text-xs uppercase tracking-wide text-white/50">
                  Question {idx + 1} • {q.category}
                </div>

                <h3 className="text-base font-medium leading-7 text-white md:text-lg">
                  {q.prompt}
                </h3>

                <div className="mt-4 grid gap-2">
                  {(["A", "B", "C", "D"] as Choice[]).map((c) => {
                    const checked = answers[q.id] === c;

                    return (
                      <label
                        key={c}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                          checked
                            ? "border-white/40 bg-white/10"
                            : "border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={c}
                          checked={checked}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [q.id]: c,
                            }))
                          }
                          className="mt-1"
                        />
                        <span className="font-semibold text-white">{c}.</span>
                        <span className="leading-6 text-white/85">{q.choices[c]}</span>
                      </label>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={submitQuiz}
              disabled={loading || !canSubmit}
              className="min-h-[48px] rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </section>
      )}

      {result && (
        <section className="mt-8 space-y-6">
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
            <div className="text-sm uppercase tracking-wide text-emerald-200/80">
              Quiz Result
            </div>
            <div className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Score: {result.score} / {result.total}
            </div>
            <p className="mt-2 text-sm leading-6 text-white/80">
              {scoreTone === "great"
                ? "Excellent work. You’re doing really well."
                : scoreTone === "good"
                ? "Nice job. Keep building your Bible knowledge."
                : "Good effort. Review the answers below and try again."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyChallengeLink}
                className="min-h-[44px] rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              >
                Copy Challenge Link
              </button>

              {share?.x ? (
                <a
                  href={share.x}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Share on X
                </a>
              ) : null}

              {share?.facebook ? (
                <a
                  href={share.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Share on Facebook
                </a>
              ) : null}

              {share?.whatsapp ? (
                <a
                  href={share.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Share on WhatsApp
                </a>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Answer Review</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Review each answer to learn and keep growing. Premium members get enhanced explanations.
            </p>

            <div className="mt-5 space-y-4">
              {review.map((item, idx) => (
                <article
                  key={item.questionId}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">
                      Question {idx + 1}
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.isCorrect
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "bg-red-500/20 text-red-200"
                      }`}
                    >
                      {item.isCorrect ? "Correct" : "Incorrect"}
                    </div>
                  </div>

                  <div className="mt-3 text-sm leading-6 text-white/90">
                    {item.prompt}
                  </div>

                  <div className="mt-4 grid gap-2 text-sm">
                    {(["A", "B", "C", "D"] as Choice[]).map((choice) => {
                      const isChosen = item.chosen === choice;
                      const isCorrect = item.correctAnswer === choice;

                      return (
                        <div
                          key={choice}
                          className={`rounded-xl border px-3 py-2 ${
                            isCorrect
                              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                              : isChosen
                              ? "border-red-400/30 bg-red-500/10 text-red-100"
                              : "border-white/10 bg-white/5 text-white/75"
                          }`}
                        >
                          <span className="font-semibold">{choice}.</span>{" "}
                          {item.choices[choice]}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 text-sm leading-6 text-white/75">
                    <span className="font-semibold text-white">Correct answer:</span>{" "}
                    {item.correctAnswer}
                  </div>

                  {item.explanation ? (
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-white/80">
                      <span className="font-semibold text-white">Explanation:</span>{" "}
                      {item.explanation}
                    </div>
                  ) : !premiumActive ? (
                    <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm leading-6 text-white/80">
                      Upgrade to Premium for answer explanations and deeper learning.
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setAttemptId(null);
                setQuestions([]);
                setAnswers({});
                setResult(null);
                setReview([]);
                setShare(null);
                setError(null);
                setUpgradePrompt(false);
              }}
              className="min-h-[44px] rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Take Another Quiz
            </button>

            {!premiumActive ? (
              <Link
                href="/pricing"
                className="min-h-[44px] rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Upgrade to Premium
              </Link>
            ) : null}
          </div>
        </section>
      )}
    </main>
  );
}

