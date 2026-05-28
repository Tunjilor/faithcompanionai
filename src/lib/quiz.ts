// src/lib/quiz.ts
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export type Choice = "A" | "B" | "C" | "D";
export type AnswerMap = Record<string, unknown>;

export type ReviewRow = {
  questionId: string;
  prompt: string;
  choices: { A: string; B: string; C: string; D: string };
  correct: Choice;
  chosen: Choice | null;
  isCorrect: boolean | null; // null if unanswered
  explanation: string | null;
};

export type GradeResult = {
  attemptId: string;
  score: number;
  total: number;
  review: ReviewRow[];
};

function isChoice(x: unknown): x is Choice {
  return x === "A" || x === "B" || x === "C" || x === "D";
}

function normalizeAnswers(input: AnswerMap): Record<string, Choice | null> {
  const out: Record<string, Choice | null> = {};
  for (const [qid, raw] of Object.entries(input || {})) {
    out[qid] = isChoice(raw) ? raw : null;
  }
  return out;
}

type AttemptWithQuestions = Prisma.QuizAttemptGetPayload<{
  include: {
    questions: {
      include: { question: true };
      orderBy: { id: "asc" };
    };
  };
}>;

type AttemptQuestionRow = AttemptWithQuestions["questions"][number];

export async function gradeAndSaveAttempt(args: {
  attemptId: string;
  answers: AnswerMap;
}): Promise<GradeResult> {
  const { attemptId, answers } = args;

  const attempt = (await db.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      questions: {
        include: { question: true },
        orderBy: { id: "asc" },
      },
    },
  })) as AttemptWithQuestions | null;

  if (!attempt) throw new Error("attempt_not_found");

  const sanitized = normalizeAnswers(answers);

  type ComputedRow = {
    aqId: string;
    questionId: string;
    chosen: Choice | null;
    correct: Choice;
    isCorrect: boolean | null;
    reviewRow: ReviewRow;
  };

  const computed: ComputedRow[] = attempt.questions.map((aq: AttemptQuestionRow) => {
    const q = aq.question;

    const correct = q.answer as Choice; // DB should store "A" | "B" | "C" | "D"
    const incoming = sanitized[q.id] ?? null;
    const isCorrect: boolean | null = incoming ? incoming === correct : null;

    const reviewRow: ReviewRow = {
      questionId: q.id,
      prompt: q.prompt,
      choices: {
        A: q.optionA,
        B: q.optionB,
        C: q.optionC,
        D: q.optionD,
      },
      correct,
      chosen: incoming,
      isCorrect,
      explanation: q.explanation ?? null,
    };

    return {
      aqId: aq.id,
      questionId: q.id,
      chosen: incoming,
      correct,
      isCorrect,
      reviewRow,
    };
  });

  const score = computed.reduce((acc: number, row: ComputedRow) => {
    return acc + (row.isCorrect === true ? 1 : 0);
  }, 0);

  const total = attempt.total ?? attempt.questions.length;

  await db.$transaction([
    ...computed.map((row: ComputedRow) =>
      db.quizAttemptQuestion.update({
        where: { id: row.aqId },
        data: {
          chosen: row.chosen,
          isCorrect: row.isCorrect,
        },
      })
    ),
    db.quizAttempt.update({
      where: { id: attemptId },
      data: { score, total },
    }),
  ]);

  return {
    attemptId,
    score,
    total,
    review: computed.map((row: ComputedRow) => row.reviewRow),
  };
}