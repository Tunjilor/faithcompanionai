import { prisma } from "@/lib/prisma";

export const FREE_ATTEMPTS_PER_DAY = 3;
export const QUESTIONS_PER_ATTEMPT = 10;

function utcDayStart(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
}
function utcDayEnd(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0));
}

export async function canStartQuiz(params: {
  isPremium: boolean;
  email?: string | null;
  sessionId?: string | null;
}) {
  if (params.isPremium) return { ok: true as const, remaining: null as number | null };

  const start = utcDayStart();
  const end = utcDayEnd();

  const where = params.email
    ? { email: params.email, createdAt: { gte: start, lt: end } }
    : { sessionId: params.sessionId ?? "anon", createdAt: { gte: start, lt: end } };

  const count = await prisma.quizAttempt.count({ where });

  const remaining = Math.max(0, FREE_ATTEMPTS_PER_DAY - count);
  if (remaining <= 0) return { ok: false as const, remaining };

  return { ok: true as const, remaining };
}

export async function createAttemptAndServeQuestions(params: {
  isPremium: boolean;
  email?: string | null;
  userId?: string | null;
  sessionId?: string | null;
  category?: string | null;
}) {
  // create attempt first
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: params.userId ?? null,
      email: params.email ?? null,
      sessionId: params.sessionId ?? null,
      category: params.category ?? null,
      total: QUESTIONS_PER_ATTEMPT,
      score: 0,
    },
  });

  // get random 10 questions (SQLite: ORDER BY RANDOM())
  const questions = await prisma.question.findMany({
    where: params.category ? { category: params.category } : undefined,
    orderBy: { id: "asc" }, // placeholder for type; overridden by raw query below
    take: QUESTIONS_PER_ATTEMPT,
  });

  // SQLite random requires raw; do it safely
  const randomQuestions: typeof questions = await prisma.$queryRaw`
    SELECT * FROM Question
    ${params.category ? prisma.$queryRaw`WHERE category = ${params.category}` : prisma.$queryRaw``}
    ORDER BY RANDOM()
    LIMIT ${QUESTIONS_PER_ATTEMPT};
  `;

  // store served questions in join table with order
  await prisma.quizAttemptQuestion.createMany({
    data: randomQuestions.map((q, idx) => ({
      attemptId: attempt.id,
      questionId: q.id,
      order: idx,
    })),
  });

  // return “safe” questions (no correct answer)
  const safeQuestions = randomQuestions.map((q) => ({
    id: q.id,
    category: q.category,
    prompt: q.prompt,
    choices: {
      A: q.choiceA,
      B: q.choiceB,
      C: q.choiceC,
      D: q.choiceD,
    },
  }));

  return { attemptId: attempt.id, questions: safeQuestions };
}

export async function gradeAndSaveAttempt(params: {
  attemptId: string;
  answers: Record<string, "A" | "B" | "C" | "D">; // questionId -> choice
}) {
  const served = await prisma.quizAttemptQuestion.findMany({
    where: { attemptId: params.attemptId },
    include: { question: true },
    orderBy: { order: "asc" },
  });

  if (served.length === 0) {
    throw new Error("Attempt not found or has no questions.");
  }

  let score = 0;

  // update each question response
  for (const aq of served) {
    const chosen = params.answers[aq.questionId] ?? null;
    const isCorrect = chosen ? chosen === aq.question.correct : null;

    if (isCorrect) score += 1;

    await prisma.quizAttemptQuestion.update({
      where: { id: aq.id },
      data: { chosen, isCorrect },
    });
  }

  const total = served.length;

  await prisma.quizAttempt.update({
    where: { id: params.attemptId },
    data: { score, total },
  });

  return {
    score,
    total,
    // optional review data
    review: served.map((aq) => ({
      questionId: aq.questionId,
      prompt: aq.question.prompt,
      correct: aq.question.correct as "A" | "B" | "C" | "D",
      chosen: (params.answers[aq.questionId] ?? null) as any,
      explanation: aq.question.explanation ?? null,
    })),
  };
}
