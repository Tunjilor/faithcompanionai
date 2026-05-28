// src/app/biblequiz/quiz-client.tsx
"use client";
import { useUser } from "@/context/UserContext";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import DenominationSelect, { readDenomination } from "@/components/DenominationSelect";

type Choice = "A" | "B" | "C" | "D";
type CategoryId = "general" | "women" | "parables" | "ai" | "theology" | "history";

type Category = {
  id: CategoryId;
  name: string;
  premium: boolean;
  hover?: string;
};

type ServerQuestion = {
  id: string;
  prompt: string;
  choices: { A: string; B: string; C: string; D: string };
  chosen?: Choice | null;
};

type UsageInfo = {
  todayUsedQuestions: number;
  todayLimitQuestions: number;
  totalUsedQuestions: number;
  totalLimitQuestions: number;
  daysUsed: number;
  daysLimit: number;
};

type StartResponse = {
  ok?: boolean;
  attemptId: string;
  questions: ServerQuestion[];
  category?: CategoryId;
  isPremium?: boolean;
  usage?: UsageInfo | null;
  error?: string;
  message?: string;
  upgradePrompt?: boolean;
  existingCategory?: string;
  softLimit?: boolean;
};

type CompletionScore = { score: number; total: number; shareId: string | null };

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

type SubmitResponse = {
  ok?: boolean;
  attemptId?: string;
  shareId?: string;
  score?: number;
  total?: number;
  redirectTo?: string;
  error?: string;
  review?: ReviewItem[];
  premiumExplanationsIncluded?: boolean;
};

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const QUESTIONS_PER_QUIZ = 10;

const categories: Category[] = [
  { id: "general", name: "General Bible Knowledge", premium: false },
  { id: "women", name: "Women of the Bible", premium: false },
  { id: "parables", name: "Jesus' Parables", premium: false },
  { id: "ai", name: "AI Bible Questions", premium: true, hover: "Premium: unlimited AI-generated questions" },
  { id: "theology", name: "Theology", premium: true, hover: "Premium: unlimited AI-generated questions" },
  { id: "history", name: "Church History", premium: true, hover: "Premium: unlimited AI-generated questions" },
];

async function postJSON<T>(url: string, body?: unknown): Promise<{ ok: boolean; data: T | any; status: number }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    cache: "no-store",
    body: body ? JSON.stringify(body) : "{}",
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, data, status: res.status };
}

// localStorage helpers for guest seen-question tracking
const LS_PREFIX = "fca_quiz_seen_";

function getLocalSeenIds(cat: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_PREFIX + cat);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

function addLocalSeenIds(cat: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalSeenIds(cat);
    const merged = [...new Set([...existing, ...ids])].slice(-300);
    localStorage.setItem(LS_PREFIX + cat, JSON.stringify(merged));
  } catch {}
}

// â"€â"€ Hard stop modal â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function HardStopModal({
  title,
  message,
  usage,
  onClose,
}: {
  title: string;
  message: string;
  usage: UsageInfo | null;
  onClose: () => void;
}) {
  const quizzesUsed = usage ? Math.floor(usage.totalUsedQuestions / QUESTIONS_PER_QUIZ) : null;
  const quizzesLimit = usage ? Math.floor(usage.totalLimitQuestions / QUESTIONS_PER_QUIZ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-black/80 shadow-2xl">
        {/* header */}
        <div className="bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-5 text-white">
          <div className="text-lg font-extrabold">{title}</div>
          <div className="mt-1 text-sm text-white/80">{message}</div>
        </div>

        {/* usage summary */}
        {usage && quizzesUsed !== null && quizzesLimit !== null && (
          <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 text-center text-xs">
            <div className="px-4 py-3">
              <div className="font-bold text-white">{quizzesUsed}/{quizzesLimit}</div>
              <div className="mt-0.5 text-white/55">Quizzes used</div>
            </div>
            <div className="px-4 py-3">
              <div className="font-bold text-white">{usage.daysUsed}/{usage.daysLimit}</div>
              <div className="mt-0.5 text-white/55">Days used</div>
            </div>
            <div className="px-4 py-3">
              <div className="font-bold text-white">{usage.todayUsedQuestions}/{usage.todayLimitQuestions}</div>
              <div className="mt-0.5 text-white/55">Today</div>
            </div>
          </div>
        )}

        {/* cta */}
        <div className="space-y-3 p-6">
          <p className="text-sm text-white/70">
            Premium removes all limits — unlimited quizzes, all categories, and your personal faith journal.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 py-3 text-center text-sm font-bold text-white hover:opacity-95"
            >
              Upgrade to Premium
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Dismiss
            </button>
          </div>

          <p className="text-center text-xs text-white/40">
            Free plan resets tomorrow at midnight UTC.
          </p>
        </div>
      </div>
    </div>
  );
}

// â"€â"€ Main component â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default function QuizClient() {
  const [busy, setBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [premiumLoaded, setPremiumLoaded] = useState(false);
  const [premium, setPremium] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string>("");

  const [category, setCategory] = useState<CategoryId>("general");
  const [denomination, setDenomination] = useState("non-denominational");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ServerQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [usage, setUsage] = useState<UsageInfo | null>(null);

  // Hard stop modal state
  const [hardStop, setHardStop] = useState(false);
  const [hardStopTitle, setHardStopTitle] = useState("");
  const [hardStopMsg, setHardStopMsg] = useState("");

  // Generic inline error (non-limit errors)
  const [inlineError, setInlineError] = useState<string | null>(null);

  // Completion state (replaces immediate redirect after submit)
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completionScore, setCompletionScore] = useState<CompletionScore | null>(null);
  const [softLimitReached, setSoftLimitReached] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [showAnswerGate, setShowAnswerGate] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [showInlineReview, setShowInlineReview] = useState(false);

  const quizAreaRef = useRef<HTMLDivElement>(null);

  const _me = useUser();
  useEffect(() => {
    setPremium(Boolean(_me.premium || _me.isPremium));
    setSignedIn(Boolean(_me.signedIn || _me.authed));
    setUserEmail(_me.email ?? null);
    setUserDisplayName(_me.displayName ?? "");
    setPremiumLoaded(true);
  }, [_me]);

  useEffect(() => {
    setDenomination(readDenomination());
    const onChanged = () => setDenomination(readDenomination());
    window.addEventListener("denomination-changed", onChanged);
    return () => window.removeEventListener("denomination-changed", onChanged);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);

  const statusLabel = useMemo(() => {
    if (!premiumLoaded) return "Checking…";
    return premium ? "Premium active ✅" : "Free plan";
  }, [premiumLoaded, premium]);

  const activeCategoryName = useMemo(
    () => categories.find((c) => c.id === category)?.name ?? "General Bible Knowledge",
    [category]
  );

  const answeredCount = useMemo(
    () => questions.reduce((acc, q) => acc + (q.chosen ? 1 : 0), 0),
    [questions]
  );

  const currentQuestion = questions[currentIndex] ?? null;
  const allAnswered = questions.length > 0 && answeredCount === questions.length;

  // Questions remaining in this quiz session (for soft prompt)
  const questionsLeftInQuiz = questions.length > 0 ? questions.length - currentIndex - 1 : null;
  const showSoftPrompt =
    !premium &&
    questions.length > 0 &&
    questionsLeftInQuiz !== null &&
    questionsLeftInQuiz <= 2 &&
    questionsLeftInQuiz > 0;

  // Usage display strings
  const usageDisplay = useMemo(() => {
    if (premium || !usage) return null;
    const quizzesUsed = Math.floor(usage.totalUsedQuestions / QUESTIONS_PER_QUIZ);
    const quizzesLeft = Math.floor((usage.totalLimitQuestions - usage.totalUsedQuestions) / QUESTIONS_PER_QUIZ);
    const daysLeft = usage.daysLimit - usage.daysUsed;
    return { quizzesUsed, quizzesLeft, daysLeft };
  }, [premium, usage]);

  function triggerHardStop(title: string, msg: string) {
    setHardStopTitle(title);
    setHardStopMsg(msg);
    setHardStop(true);
    // Clear quiz state so they can't continue
    setAttemptId(null);
    setQuestions([]);
    setCurrentIndex(0);
  }

  function handleApiError(data: any) {
    if (!data) {
      setInlineError("Something went wrong. Please try again.");
      return;
    }

    // Capture usage from error responses too
    if (data.usage) setUsage(data.usage);

    if (data.error === "daily_limit_reached") {
      triggerHardStop(
        "You've used today's free quiz",
        data.message || "Free users get 10 questions per day. Come back tomorrow or upgrade for unlimited access."
      );
      return;
    }

    if (data.error === "trial_limit_reached") {
      triggerHardStop(
        "Free trial complete",
        data.message || "You've used all 30 free questions across 3 days. Upgrade to keep going."
      );
      return;
    }

    if (data.error === "signin_required") {
      triggerHardStop(
        "Sign in to continue",
        data.message || "Your guest trial has ended. Sign in to continue for free or upgrade for unlimited access."
      );
      return;
    }

    if (data.error === "premium_required") {
      setInlineError(data.message || "That category is available on Premium.");
      return;
    }

    if (data.error === "reset_not_allowed") {
      setInlineError(data.message || "You can only reset today's quiz.");
      return;
    }

    setInlineError(data.message || data.error || "Something went wrong. Please try again.");
  }

  async function startQuiz(nextCategory?: CategoryId) {
    const cat = nextCategory ?? category;

    setBusy(true);
    setInlineError(null);
    setAttemptId(null);
    setQuestions([]);
    setCurrentIndex(0);
    setQuizCompleted(false);
    setCompletionScore(null);
    setSoftLimitReached(false);
    setShowAnswerGate(false);
    setReviewItems([]);
    setShowInlineReview(false);

    const clientSeenIds = !signedIn ? getLocalSeenIds(cat) : [];

    const { ok, data } = await postJSON<StartResponse>("/api/quiz/start", {
      category: cat,
      ...(clientSeenIds.length > 0 ? { clientSeenIds } : {}),
    });

    if (!ok) {
      handleApiError(data);
      setBusy(false);
      return;
    }

    const attempt = data as StartResponse;

    if (!attempt?.attemptId || !Array.isArray(attempt?.questions)) {
      setInlineError("Quiz start returned an unexpected response.");
      setBusy(false);
      return;
    }

    // Deduplicate by ID in-memory — guarantees zero repeats within this session
    // regardless of what the server returned.
    const seenInSession = new Set<string>();
    const dedupedQuestions = attempt.questions.filter((q) => {
      if (seenInSession.has(q.id)) return false;
      seenInSession.add(q.id);
      return true;
    });

    if (!signedIn && dedupedQuestions.length > 0) {
      addLocalSeenIds(cat, dedupedQuestions.map((q) => q.id));
    }

    setAttemptId(attempt.attemptId);
    setQuestions(dedupedQuestions);
    setCurrentIndex(0);
    if (attempt.usage) setUsage(attempt.usage);
    if (attempt.softLimit) setSoftLimitReached(true);
    setBusy(false);
    setTimeout(() => quizAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  async function restartQuiz() {
    const prevAttemptId = attemptId;
    setBusy(true);
    setInlineError(null);
    setAttemptId(null);
    setQuestions([]);
    setCurrentIndex(0);
    setQuizCompleted(false);
    setCompletionScore(null);
    setSoftLimitReached(false);
    setShowAnswerGate(false);

    const reset = await postJSON("/api/quiz/reset", { attemptId: prevAttemptId });
    if (!reset.ok) {
      handleApiError(reset.data);
      setBusy(false);
      return;
    }

    await startQuiz(category);
  }

  async function saveGuestName() {
    const name = displayName.trim();
    if (!name) { setToast("Enter a display name first."); return; }

    setSavingName(true);
    const { ok, data } = await postJSON("/api/guest/name", { name });
    setSavingName(false);

    if (!ok) { setToast(data?.message || "Could not save name."); return; }
    setToast("Saved ✅");
  }

  function setChoice(qid: string, choice: Choice) {
    setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, chosen: choice } : q)));
  }

  async function submitQuiz() {
    if (!attemptId) { setToast("Start a quiz first."); return; }
    if (!allAnswered) { setToast("Please answer all questions before submitting."); return; }

    setSubmitting(true);

    const answers = questions.map((q) => ({ questionId: q.id, chosen: q.chosen ?? null }));

    const { ok, data } = await postJSON<SubmitResponse>("/api/quiz/submit", { attemptId, answers });

    setSubmitting(false);

    if (!ok) { handleApiError(data); return; }

    const score = typeof data?.score === "number" ? data.score : 0;
    const total = typeof data?.total === "number" ? data.total : QUESTIONS_PER_QUIZ;
    const shareId = data?.shareId ?? null;

    if (Array.isArray(data?.review)) setReviewItems(data.review);
    setCompletionScore({ score, total, shareId });
    setQuizCompleted(true);
  }

  return (
    <>
      {/* Hard stop modal */}
      {hardStop && (
        <HardStopModal
          title={hardStopTitle}
          message={hardStopMsg}
          usage={usage}
          onClose={() => setHardStop(false)}
        />
      )}

      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        {/* â"€â"€ Header â"€â"€ */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-white">Bible Quiz</h1>
            <div className="mt-1 text-white/70">Test your Scripture knowledge</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
              {statusLabel}
            </div>

            <DenominationSelect className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80 border-0 outline-none" />

            <button
              onClick={restartQuiz}
              disabled={busy}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-60"
              title="Restart resets today's quiz (if allowed)"
            >
              Restart
            </button>

            {!premium && (
              <Link
                href="/pricing"
                className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Go Premium
              </Link>
            )}
          </div>
        </div>

        {/* â"€â"€ Toast â"€â"€ */}
        {toast && (
          <div className="mb-4 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white">
            {toast}
          </div>
        )}

        {/* â"€â"€ Inline error (non-limit errors) â"€â"€ */}
        {inlineError && (
          <div className="mb-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-4 text-white">
            <div className="font-semibold">âš ï¸ {inlineError}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/pricing" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
                Go Premium
              </Link>
              <button onClick={() => setInlineError(null)} className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15">
                Close
              </button>
            </div>
          </div>
        )}

        {/* â"€â"€ Player info strip â"€â"€ */}
        <div className="mb-4 rounded-2xl bg-white/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {signedIn ? (
              <div className="text-white/80">
                Playing as{" "}
                <span className="font-semibold text-white">{userDisplayName || userEmail || "Member"}</span>
                <span className="ml-2 text-sm">
                  {premium
                    ? <span className="text-emerald-400">Premium ✅</span>
                    : <span className="text-white/50">Free plan</span>}
                </span>
                <span className="ml-2 text-white/40 text-sm">• {answeredCount}/{QUESTIONS_PER_QUIZ} answered</span>
              </div>
            ) : (
              <div className="text-white/80">
                Playing as <span className="font-semibold text-white">Guest</span>
                <span className="ml-2 text-white/50 text-sm">(Free mode • {answeredCount}/{QUESTIONS_PER_QUIZ} answered)</span>
              </div>
            )}

            {!signedIn && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Set your display name"
                  className="w-full sm:w-56 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none"
                />
                <button
                  onClick={saveGuestName}
                  disabled={savingName}
                  className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-60"
                >
                  {savingName ? "Saving…" : "Save name"}
                </button>
                <Link
                  href="/login?redirect=%2Fbiblequiz"
                  className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>

          {/* Usage tracker — only for free/guest users when we have usage data */}
          {usageDisplay && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-xs text-white/50">
              <span>
                Free trial:{" "}
                <span className={classNames("font-semibold", usageDisplay.quizzesLeft <= 1 ? "text-orange-400" : "text-white/70")}>
                  {usageDisplay.quizzesLeft} quiz{usageDisplay.quizzesLeft !== 1 ? "zes" : ""} remaining
                </span>
              </span>
              <span>
                Days:{" "}
                <span className={classNames("font-semibold", usageDisplay.daysLeft <= 1 ? "text-orange-400" : "text-white/70")}>
                  {usageDisplay.daysLeft} of {usage!.daysLimit} left
                </span>
              </span>
              <Link href="/pricing" className="ml-auto text-orange-400 underline underline-offset-2 hover:text-orange-300">
                Upgrade for unlimited →
              </Link>
            </div>
          )}
        </div>

        {/* â"€â"€ Category grid â"€â"€ */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((c) => {
            const isActive = c.id === category;
            return (
              <button
                key={c.id}
                title={c.hover || c.name}
                disabled={busy}
                onClick={async () => {
                  setCategory(c.id);
                  await startQuiz(c.id);
                }}
                className={classNames(
                  "rounded-2xl border px-5 py-4 text-left transition",
                  "border-white/10 bg-white/5 hover:bg-white/10",
                  isActive && "border-white/30 bg-white/10",
                  busy && "opacity-60"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-white">{c.name}</div>
                  {c.premium ? (
                    <span className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-3 py-1 text-xs font-bold text-white">
                      Premium
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                      Free
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-white/60">
                  {c.premium ? "Premium category" : "Free category"}
                </div>
              </button>
            );
          })}
        </div>

        {/* â"€â"€ Quiz area â"€â"€ */}
        <div ref={quizAreaRef} className="rounded-2xl bg-white/5 p-5">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-white/80">
              Category: <span className="font-semibold text-white">{activeCategoryName}</span>
            </div>
            <div className="text-sm text-white/50">
              Attempt: {attemptId ? <span className="text-white/70">{attemptId.slice(0, 8)}…</span> : "—"}
            </div>
          </div>

          {busy ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-white/80">
              Loading quiz…
            </div>
          ) : quizCompleted && completionScore ? (
            <div className="space-y-5">
              {/* Score */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <div className="text-5xl font-extrabold text-white">
                  {completionScore.score}/{completionScore.total}
                </div>
                <div className="mt-2 text-lg font-semibold text-white/70">
                  {completionScore.score === completionScore.total
                    ? "Perfect score! 🎉"
                    : completionScore.score >= completionScore.total * 0.8
                    ? "Excellent work!"
                    : completionScore.score >= completionScore.total * 0.6
                    ? "Good effort!"
                    : "Keep studying — you've got this!"}
                </div>
                <div className="mt-1 text-sm text-white/50">{activeCategoryName}</div>
              </div>

              {/* Guest warm CTA */}
              {!signedIn && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-semibold text-white">Great job!</div>
                  <p className="mt-2 text-sm text-white/70">
                    Create a free account to track your progress and avoid repeat questions. It takes 30 seconds — just your email, no password required.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/login?redirect=%2Fbiblequiz"
                      className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90"
                    >
                      Create Free Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => { setQuizCompleted(false); setCompletionScore(null); }}
                      className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Continue as Guest
                    </button>
                  </div>
                </div>
              )}

              {/* Soft limit message for registered free users */}
              {signedIn && !premium && softLimitReached && (
                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                  <div className="font-semibold text-orange-100">You&apos;ve completed your free questions!</div>
                  <p className="mt-1 text-sm text-orange-200/80">
                    Go Premium for unlimited questions, all categories, and your personal faith journal.
                  </p>
                  <Link
                    href="/pricing"
                    className="mt-3 inline-block rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {completionScore.shareId && (
                  <Link
                    href={`/quiz/results/${completionScore.shareId}`}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90"
                  >
                    View Results
                  </Link>
                )}
                <button
                  type="button"
                  onClick={async () => { await startQuiz(category); }}
                  disabled={busy}
                  className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
                >
                  Play Again
                </button>
              </div>

              {/* See Correct Answers — inline for premium, gated for free */}
              {completionScore.score < completionScore.total && (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (premium) {
                        setShowInlineReview((v) => !v);
                      } else {
                        setShowAnswerGate((v) => !v);
                      }
                    }}
                    className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    {premium
                      ? showInlineReview ? "Hide Answers" : "See Correct Answers"
                      : "🔒 See Correct Answers"}
                  </button>

                  {/* Premium: inline per-question review */}
                  {premium && showInlineReview && (
                    <div className="mt-5 space-y-3">
                      {reviewItems.length > 0 ? reviewItems.map((item, idx) => (
                        <div
                          key={item.questionId}
                          className={`rounded-2xl border p-4 ${
                            item.isCorrect
                              ? "border-green-500/40 bg-green-900/10"
                              : "border-red-500/40 bg-red-900/10"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-sm font-semibold text-white">
                              {idx + 1}. {item.prompt}
                            </div>
                            <span className={`shrink-0 text-xs font-bold ${item.isCorrect ? "text-green-400" : "text-red-400"}`}>
                              {item.isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          </div>
                          <div className="mt-3 space-y-1 text-sm">
                            <div className="text-white/70">
                              Your answer:{" "}
                              <span className={item.isCorrect ? "text-green-300" : "text-red-300"}>
                                {item.chosen ? `${item.chosen}. ${item.choices[item.chosen]}` : "—"}
                              </span>
                            </div>
                            {!item.isCorrect && (
                              <div className="text-white/70">
                                Correct answer:{" "}
                                <span className="text-green-300">
                                  {item.correctAnswer}. {item.choices[item.correctAnswer]}
                                </span>
                              </div>
                            )}
                            {item.explanation && (
                              <div className="mt-2 rounded-xl bg-white/5 px-3 py-2 text-xs leading-6 text-white/70">
                                <span className="font-semibold text-white/85">Explanation: </span>
                                {item.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      )) : (
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                          Review data unavailable for this session.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Free: upgrade gate */}
                  {showAnswerGate && !premium && (
                    <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                      <div className="font-semibold text-amber-100">Unlock Correct Answers</div>
                      <p className="mt-2 text-sm leading-6 text-amber-200/80">
                        See which questions you missed and get detailed explanations for every answer. Available on Premium.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href="/pricing"
                          className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
                        >
                          Upgrade to Premium
                        </Link>
                        <button
                          type="button"
                          onClick={() => setShowAnswerGate(false)}
                          className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : !attemptId || questions.length === 0 || !currentQuestion ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-white/70">
              Select a category above to start.
            </div>
          ) : (
            <div className="space-y-5">
              {/* Soft upgrade prompt — shown at question 8 and 9 (2 or 1 left) */}
              {showSoftPrompt && (
                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
                  <div className="font-semibold">
                    {questionsLeftInQuiz === 1
                      ? "Last question — this is your daily free quiz"
                      : `${questionsLeftInQuiz} questions left in today's free quiz`}
                  </div>
                  <div className="mt-1 text-orange-200/80">
                    Upgrade to Premium for unlimited daily quizzes across all categories.{" "}
                    <Link href="/pricing" className="font-semibold underline underline-offset-2 hover:text-white">
                      Upgrade now →
                    </Link>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-white/60">
                  Question {currentIndex + 1} of {questions.length}
                </div>

                <div className="mt-2 font-semibold text-white">{currentQuestion.prompt}</div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {(["A", "B", "C", "D"] as Choice[]).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChoice(currentQuestion.id, ch)}
                      className={classNames(
                        "rounded-xl border px-4 py-3 text-left transition",
                        "border-white/10 bg-white/5 hover:bg-white/10",
                        currentQuestion.chosen === ch && "border-white/30 bg-white/10"
                      )}
                    >
                      <div className="font-semibold text-white/90">{ch}</div>
                      <div className="text-sm text-white/70">{currentQuestion.choices[ch]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-white/60">
                  Answered {answeredCount}/{questions.length}
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((i) => i - 1)}
                    className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((i) => i + 1)}
                      className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={submitQuiz}
                      disabled={!allAnswered || submitting}
                      className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : "Submit & Share"}
                    </button>
                  )}
                </div>
              </div>

              {!allAnswered && currentIndex === questions.length - 1 && (
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm text-yellow-100">
                  Answer all questions to unlock your shareable results page.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


