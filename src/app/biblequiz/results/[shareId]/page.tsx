// src/app/biblequiz/results/[shareId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import ShareButtons from "./share-buttons";
import LeaderboardBlock from "@/components/quiz/LeaderboardBlock";

type AttemptWithQuestions = Prisma.QuizAttemptGetPayload<{
  include: {
    questions: {
      include: { question: true };
      orderBy: { id: "asc" };
    };
  };
}>;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: { shareId: string };
};

type Choice = "A" | "B" | "C" | "D";

function titleCase(s: string) {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function pct(score: number, total: number) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const shareId = String(params.shareId || "").trim();

  const attempt = await db.quizAttempt.findFirst({
    where: { shareId },
    select: { category: true, score: true, total: true },
  });

  if (!attempt) {
    return {
      title: "Quiz Results",
      description: "Quiz results not found.",
      robots: { index: false, follow: false },
    };
  }

  const scoreText = `${attempt.score}/${attempt.total} (${pct(attempt.score, attempt.total)}%)`;
  const categoryName = titleCase(attempt.category || "general");
  const urlPath = `/biblequiz/results/${shareId}`;
  const ogImage = `https://faithcompanionai.com/api/og/quiz-results/${shareId}`;

  return {
    title: `Bible Quiz Results — ${scoreText}`,
    description: `Category: ${categoryName}. Score: ${scoreText}.`,
    alternates: { canonical: urlPath },
    openGraph: {
      title: `Bible Quiz Results — ${scoreText}`,
      description: `Category: ${categoryName}. Can your friends beat this score?`,
      url: `https://faithcompanionai.com${urlPath}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Bible quiz score ${scoreText}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Bible Quiz Results — ${scoreText}`,
      description: `Category: ${categoryName}. Can your friends beat this score?`,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const shareId = String(params.shareId || "").trim();
  if (!shareId) return notFound();

  const attempt: AttemptWithQuestions | null = await db.quizAttempt.findFirst({
    where: { shareId },
    include: {
      questions: {
        include: { question: true },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!attempt) return notFound();

  const categoryName = titleCase(attempt.category || "general");

  let correctCount = 0;

  attempt.questions.forEach((aq: AttemptWithQuestions["questions"][number]) => {
    if (aq.chosen && aq.chosen === aq.question.answer) correctCount++;
  });

  const total = attempt.questions.length || attempt.total || 0;
  const percent = total ? Math.round((correctCount / total) * 100) : 0;

  const scoreText = `${correctCount}/${total}`;
  const shareUrl = `https://faithcompanionai.com/biblequiz/results/${shareId}`;
  const shareText = `I scored ${scoreText} (${percent}%) on Faith Companion AI — Bible Quiz (${categoryName}). Can you beat me?`;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-16 pt-8 md:px-6">
      <section className="rounded-3xl bg-gradient-to-r from-purple-600 to-orange-500 p-[1px]">
        <div className="rounded-3xl bg-black/35 px-6 py-10 text-center backdrop-blur">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Quiz Results
          </h1>
          <p className="mt-2 text-white/80">Share your score + review answers</p>
        </div>
      </section>

      <div className="fc-surface rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm text-white/70">Category</div>
            <div className="text-xl font-bold text-white">{categoryName}</div>
            <div className="mt-1 text-xs text-white/50">
              Completed: {attempt.createdAt.toLocaleString()}
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-sm text-white/70">Score</div>
            <div className="text-3xl font-extrabold text-white">{scoreText}</div>
            <div className="text-sm text-white/70">{percent}%</div>
          </div>
        </div>

        <div className="mt-6">
          <ShareButtons shareUrl={shareUrl} shareText={shareText} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/biblequiz"
            className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-center text-sm font-semibold text-white hover:opacity-95"
          >
            Take Another Quiz
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white"
          >
            Go Premium
          </Link>
        </div>
      </div>

      <LeaderboardBlock
        category={attempt.category}
        currentShareId={shareId}
        title="Can anyone beat this score?"
      />

      <section className="space-y-4">
        <div className="text-xl font-extrabold text-white">Review</div>

        {attempt.questions.map((aq: AttemptWithQuestions["questions"][number], i: number) => {
          const q = aq.question;

          const chosen = (aq.chosen ?? null) as Choice | null;
          const correct = (q.answer ?? null) as Choice | null;
          const isCorrect = !!chosen && !!correct && chosen === correct;

          const chosenText =
            chosen === "A"
              ? q.optionA
              : chosen === "B"
              ? q.optionB
              : chosen === "C"
              ? q.optionC
              : chosen === "D"
              ? q.optionD
              : null;

          const correctText =
            correct === "A"
              ? q.optionA
              : correct === "B"
              ? q.optionB
              : correct === "C"
              ? q.optionC
              : correct === "D"
              ? q.optionD
              : null;

          return (
            <div
              key={aq.id}
              className={`rounded-2xl border p-5 ${
                chosen
                  ? isCorrect
                    ? "border-green-500/60 bg-green-900/15"
                    : "border-red-500/60 bg-red-900/15"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="font-semibold text-white">
                  {i + 1}. {q.prompt}
                </div>
                <div className="text-xs font-bold">
                  {chosen ? (
                    isCorrect ? (
                      <span className="text-green-400">✅ Correct</span>
                    ) : (
                      <span className="text-red-400">❌ Incorrect</span>
                    )
                  ) : (
                    <span className="text-white/50">Not answered</span>
                  )}
                </div>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div className="text-white/80">
                  Your answer:{" "}
                  <span className={chosen ? (isCorrect ? "text-green-300" : "text-red-300") : "text-white/50"}>
                    {chosen ? `${chosen}. ${chosenText}` : "—"}
                  </span>
                </div>

                <div className="text-white/80">
                  Correct answer:{" "}
                  <span className="text-green-300">
                    {correct ? `${correct}. ${correctText}` : "—"}
                  </span>
                </div>

                {q.explanation ? (
                  <div className="mt-2 text-xs text-white/70">
                    <span className="font-semibold text-white/80">Explanation: </span>
                    {q.explanation}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}