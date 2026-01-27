import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const QUESTIONS_PER_QUIZ = 10;
const FREE_ATTEMPTS_PER_DAY = 3;

// UTC day window to avoid timezone weirdness
function getUtcDayRange(d = new Date()) {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0));
  return { start, end };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, category, timed = false } = body ?? {};

    if (!email || !category) {
      return NextResponse.json(
        { error: "Missing email or category" },
        { status: 400 }
      );
    }

    // email-based user lookup for now
    const user = await prisma.user.findUnique({ where: { email } });
    const isPremium = user?.isPremium === true;

    // ----- Free user daily limit -----
    if (!isPremium) {
      const { start, end } = getUtcDayRange();

      const attemptsToday = await prisma.quizAttempt.count({
        where: {
          email,
          createdAt: { gte: start, lt: end },
        },
      });

      if (attemptsToday >= FREE_ATTEMPTS_PER_DAY) {
        return NextResponse.json(
          {
            blocked: true,
            reason: "daily_limit",
            message: "Free users are limited to 3 quizzes per day.",
            remainingAttempts: 0,
          },
          { status: 403 }
        );
      }
    }

    // ----- Create quiz attempt first -----
    const attempt = await prisma.quizAttempt.create({
      data: {
        email,
        category,
        total: QUESTIONS_PER_QUIZ,
        timed,
      },
    });

    // ----- Get 10 random questions (SQLite: RANDOM()) -----
    const questions = await prisma.$queryRaw<
      {
        id: string;
        category: string;
        prompt: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
      }[]
    >`
      SELECT id, category, prompt, optionA, optionB, optionC, optionD
      FROM Question
      WHERE category = ${category}
      ORDER BY RANDOM()
      LIMIT ${QUESTIONS_PER_QUIZ}
    `;

    if (questions.length < QUESTIONS_PER_QUIZ) {
      // rollback attempt so you don't create empty attempts
      await prisma.quizAttempt.delete({ where: { id: attempt.id } });

      return NextResponse.json(
        { error: "Not enough questions in this category" },
        { status: 400 }
      );
    }

    // ----- Link questions to attempt -----
    await prisma.quizAttemptQuestion.createMany({
      data: questions.map((q) => ({
        attemptId: attempt.id,
        questionId: q.id,
      })),
    });

    // remaining attempts for free users (nice for UI)
    let remainingAttempts: number | null = null;
    if (!isPremium) {
      const { start, end } = getUtcDayRange();
      const attemptsToday = await prisma.quizAttempt.count({
        where: { email, createdAt: { gte: start, lt: end } },
      });
      remainingAttempts = Math.max(0, FREE_ATTEMPTS_PER_DAY - attemptsToday);
    }

    return NextResponse.json({
      attemptId: attempt.id,
      timed,
      questions,
      remainingAttempts,
      isPremium,
    });
  } catch (err) {
    console.error("START QUIZ ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
