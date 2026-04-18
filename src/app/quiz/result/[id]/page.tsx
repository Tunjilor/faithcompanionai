// src/app/quiz/result/[id]/page.tsx
import { db } from "@/lib/db";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const attempt = await db.quizAttempt.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        include: {
          question: true,
        },
      },
    },
  });

  if (!attempt) {
    return (
      <div className="fc-surface p-8">
        <h1 className="text-2xl font-semibold">Result not found</h1>
        <p className="mt-2 opacity-80">
          We couldn&apos;t find that quiz attempt.
        </p>
        <div className="mt-6 flex gap-3">
          <Link className="fc-btn" href="/quiz">
            Back to Quiz
          </Link>
          <Link className="fc-btn-outline" href="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const score = attempt.score ?? 0;
  const total = attempt.total ?? 10;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="fc-surface p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Quiz Results</h1>
        <p className="opacity-80">
          Category: <span className="font-medium">{attempt.category}</span>
          {attempt.timed ? (
            <>
              {" "}
              • Timed
              {typeof attempt.durationSeconds === "number" ? (
                <>
                  {" "}
                  • Duration:{" "}
                  <span className="font-medium">{attempt.durationSeconds}s</span>
                </>
              ) : null}
            </>
          ) : null}
        </p>
      </div>

      <div className="mt-6 rounded-xl border p-5">
        <div className="text-sm opacity-70">Score</div>
        <div className="mt-1 text-3xl font-bold">
          {score} / {total}{" "}
          <span className="text-base font-semibold opacity-70">({percent}%)</span>
        </div>
        <div className="mt-5 flex gap-3">
          <Link className="fc-btn" href="/quiz">
            Take another quiz
          </Link>
          <Link className="fc-btn-outline" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Review</h2>

      <div className="mt-4 space-y-4">
        {attempt.questions.map((aq: any, idx: number) => {
          const q = aq.question;
          const chosen = aq.chosen ?? "";
          const answer = q.answer ?? "";
          const isCorrect = aq.isCorrect === true;

          return (
            <div key={aq.id} className="rounded-xl border p-5">
              <div className="text-sm opacity-70">Question {idx + 1}</div>
              <div className="mt-1 font-medium">{q.prompt}</div>

              <div className="mt-3 grid gap-2 text-sm">
                <div>
                  <span className="opacity-70">Your answer:</span>{" "}
                  <span className="font-semibold">{chosen || "—"}</span>
                </div>
                <div>
                  <span className="opacity-70">Correct answer:</span>{" "}
                  <span className="font-semibold">{answer}</span>
                </div>
                <div>
                  <span className="opacity-70">Result:</span>{" "}
                  <span className="font-semibold">
                    {isCorrect ? "Correct ✅" : "Incorrect ❌"}
                  </span>
                </div>

                {q.explanation ? (
                  <div className="mt-2 opacity-80">
                    <span className="font-medium">Explanation:</span> {q.explanation}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
