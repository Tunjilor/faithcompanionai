// src/lib/quiz.ts
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const FREE_ATTEMPTS_PER_DAY = 3;
export const QUESTIONS_PER_ATTEMPT = 10;

function utcDayStart(d = new Date()) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0)
  );
}
function utcDayEnd(d = new Date()) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0)
  );
}

export async function canStartQuiz(params: {
  isPremium: boolean;
  email?: string | null;
}) {
  if (params.isPremium) return { ok: true as const, remaining: null as number | null };

  // If we don't have an email, we can't reliably enforce daily limits with your current schema.
  if (!params.email) return { ok: true as const, remaining: FREE_ATTEMPTS_PER_DAY };

  const start = utcDayStart();
  const end = utcDayEnd();

  const count = await db.quizAttempt.count({
    where: {
      email: params.email,
      createdAt: { gte: start, lt: end },
    },
  });

  const remaining = Math.max(0, FREE_ATTEMPTS_PER_DAY - count);
  if (remaining <= 0) return { ok: false as const, remaining };

  return { ok: true as const, remaining };
}

export async function createAttemptAndServeQuestions(params: {
  isPremium: boolean;
  email?: string | null;
  userId?: string | null;
  category?: string | null;
  timed?: boolean;
  durationSeconds?: number | null;
}) {
  const category =
    typeof params.category === "string" && params.category.trim()
      ? params.category.trim()
      : "general";

  // Create attempt first
  const attempt = await db.quizAttempt.create({
    data: {
      userId: params.userId ?? null,
      email: params.email ?? null,
      category,
      total: QUESTIONS_PER_ATTEMPT,
      score: 0,
      timed: Boolean(params.timed),
      durationSeconds: params.durationSeconds ?? null,
    },
  });

  // SQLite random selection via $queryRaw (SAFE with Prisma.sql)
  const whereCategory =
    category && category !== "general"
      ? Prisma.sql`WHERE category = ${category}`
      : Prisma.empty;

  const rows = await db.$queryRaw<
    Array<{
      id: string;
      category: string;
      prompt: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      answer: string;
      explanation: string | null;
    }>
  >(Prisma.sql`
    SELECT id, category, prompt, optionA, optionB, optionC, optionD, answer, explanation
    FROM Question
    ${whereCategory}
    ORDER BY RANDOM()
    LIMIT ${QUESTIONS_PER_ATTEMPT}
  `);

  if (!rows.length) {
    throw new Error("No questions found for the selected category.");
  }

  // Store served questions in join table
  await db.quizAttemptQuestion.createMany({
  data: rows.map((q) => ({
    attemptId: attempt.id,
    questionId: q.id,
  })),
});

  // Return safe questions (no correct answer)
  const safeQuestions = rows.map((q) => ({
    id: q.id,
    category: q.category,
    prompt: q.prompt,
    choices: {
      A: q.optionA,
      B: q.optionB,
      C: q.optionC,
      D: q.optionD,
    },
  }));

  return { attemptId: attempt.id, questions: safeQuestions };
}

export async function gradeAndSaveAttempt(params: {
  attemptId: string;
  answers: Record<string, "A" | "B" | "C" | "D">; // questionId -> choice
}) {
  const served = await db.quizAttemptQuestion.findMany({
    where: { attemptId: params.attemptId },
    include: { question: true },
  });

  if (served.length === 0) {
    throw new Error("Attempt not found or has no questions.");
  }

  let score = 0;

  for (const aq of served) {
    const chosen = params.answers[aq.questionId] ?? null;
    const correct = aq.question.answer as "A" | "B" | "C" | "D";
    const isCorrect = chosen ? chosen === correct : null;

    if (isCorrect) score += 1;

    await db.quizAttemptQuestion.update({
      where: { id: aq.id },
      data: { chosen, isCorrect },
    });
  }

  const total = served.length;

  await db.quizAttempt.update({
    where: { id: params.attemptId },
    data: { score, total },
  });

  return {
    score,
    total,
    review: served.map((aq) => ({
      questionId: aq.questionId,
      prompt: aq.question.prompt,
      correct: aq.question.answer as "A" | "B" | "C" | "D",
      chosen: (params.answers[aq.questionId] ?? null) as any,
      explanation: aq.question.explanation ?? null,
    })),
  };
}
