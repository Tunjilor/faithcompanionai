// src/app/api/quiz/submit/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/lib/db";
import { getUserFromSession, isUserPremium } from "@/lib/premium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Choice = "A" | "B" | "C" | "D";

type SubmitBody =
  | {
      attemptId?: string;
      answers?: Record<string, Choice>;
    }
  | {
      attemptId?: string;
      answers?: Array<{
        questionId: string;
        chosen: Choice | null;
      }>;
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

function makeShareId() {
  return crypto.randomBytes(8).toString("hex");
}

function toRecordAnswers(
  rawAnswers: SubmitBody["answers"]
): Map<string, Choice | null> {
  const answersMap = new Map<string, Choice | null>();

  if (!rawAnswers) {
    return answersMap;
  }

  if (Array.isArray(rawAnswers)) {
    for (const row of rawAnswers) {
      if (!row?.questionId) continue;

      const chosen =
        row.chosen === "A" ||
        row.chosen === "B" ||
        row.chosen === "C" ||
        row.chosen === "D"
          ? row.chosen
          : null;

      answersMap.set(row.questionId, chosen);
    }

    return answersMap;
  }

  for (const [questionId, chosen] of Object.entries(rawAnswers)) {
    const normalized =
      chosen === "A" || chosen === "B" || chosen === "C" || chosen === "D"
        ? chosen
        : null;

    answersMap.set(questionId, normalized);
  }

  return answersMap;
}

function safeDisplayNameFromEmail(email?: string | null) {
  if (!email) return "Faith Friend";
  const local = email.split("@")[0]?.trim() || "";
  if (!local) return "Faith Friend";
  return local.slice(0, 32);
}

function buildChallengeUrl(req: Request, displayName: string, score: number, total: number) {
  const url = new URL(req.url);
  const origin = url.origin;

  return `${origin}/quiz/challenge?u=${encodeURIComponent(
    displayName
  )}&s=${encodeURIComponent(String(score))}&t=${encodeURIComponent(String(total))}`;
}

function buildShareLinks(
  challengeUrl: string,
  displayName: string,
  score: number,
  total: number
) {
  const shareText = `${displayName} scored ${score}/${total} on Faith Companion AI Bible Quiz. Can you beat it?`;

  return {
    shareText,
    challengeUrl,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(challengeUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      challengeUrl
    )}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${challengeUrl}`)}`,
  };
}

async function buildPremiumExplanations(reviewItems: ReviewItem[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return reviewItems.map((item) => ({
      questionId: item.questionId,
      explanation: item.explanation || null,
    }));
  }

  const openai = new OpenAI({ apiKey });

  const prompt = `
You are helping explain Bible quiz results.

Return ONLY valid JSON as an array.
Each item must have:
- questionId: string
- explanation: string

Rules:
- 1 to 2 sentences per explanation
- Be accurate, simple, encouraging, and clear
- Explain why the correct answer is correct
- If the user's chosen answer is wrong, gently say why it is not correct
- Do not include markdown
- Do not include any text outside JSON

Quiz items:
${JSON.stringify(
  reviewItems.map((item) => ({
    questionId: item.questionId,
    prompt: item.prompt,
    category: item.category,
    choices: item.choices,
    chosen: item.chosen,
    correctAnswer: item.correctAnswer,
    isCorrect: item.isCorrect,
  })),
  null,
  2
)}
`.trim();

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const raw = response.output_text?.trim();
    if (!raw) {
      return reviewItems.map((item) => ({
        questionId: item.questionId,
        explanation: item.explanation || null,
      }));
    }

    const parsed = JSON.parse(raw) as Array<{
      questionId?: string;
      explanation?: string;
    }>;

    const explanationMap = new Map<string, string>();

    for (const row of parsed) {
      if (
        typeof row?.questionId === "string" &&
        typeof row?.explanation === "string" &&
        row.explanation.trim()
      ) {
        explanationMap.set(row.questionId, row.explanation.trim());
      }
    }

    return reviewItems.map((item) => ({
      questionId: item.questionId,
      explanation:
        explanationMap.get(item.questionId) || item.explanation || null,
    }));
  } catch (err) {
    console.error("QUIZ EXPLANATION ERROR:", err);

    return reviewItems.map((item) => ({
      questionId: item.questionId,
      explanation: item.explanation || null,
    }));
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubmitBody;

    const attemptId =
      typeof body?.attemptId === "string" ? body.attemptId.trim() : "";

    if (!attemptId) {
      return NextResponse.json(
        { ok: false, error: "Missing attemptId." },
        { status: 400 }
      );
    }

    const attempt = await db.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        questions: {
          include: { question: true },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { ok: false, error: "Quiz attempt not found." },
        { status: 404 }
      );
    }

    const answersMap = toRecordAnswers(body?.answers);

    let score = 0;

    const updates = attempt.questions.map((aq) => {
      const chosen = answersMap.has(aq.questionId)
        ? answersMap.get(aq.questionId) ?? null
        : aq.chosen ?? null;

      const isCorrect = !!chosen && chosen === aq.question.answer;

      if (isCorrect) {
        score += 1;
      }

      return {
        id: aq.id,
        questionId: aq.questionId,
        chosen,
        isCorrect,
        question: aq.question,
      };
    });

    await db.$transaction(
      updates.map((row) =>
        db.quizAttemptQuestion.update({
          where: { id: row.id },
          data: {
            chosen: row.chosen,
            isCorrect: row.isCorrect,
          },
        })
      )
    );

    const total = attempt.questions.length || attempt.total || 10;

    let shareId = attempt.shareId;
    if (!shareId) {
      shareId = makeShareId();
    }

    await db.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        score,
        total,
        shareId,
        sharedAt: new Date(),
      },
    });

    const sessionUser = await getUserFromSession();
    const premiumActive = sessionUser ? isUserPremium(sessionUser) : false;

    const reviewItems: ReviewItem[] = updates.map((row) => ({
      questionId: row.questionId,
      prompt: row.question.prompt,
      category: row.question.category,
      chosen: row.chosen as Choice | null,
      correctAnswer: row.question.answer as Choice,
      isCorrect: row.isCorrect,
      explanation: row.question.explanation ?? null,
      choices: {
        A: row.question.optionA,
        B: row.question.optionB,
        C: row.question.optionC,
        D: row.question.optionD,
      },
    }));

    const explanations = premiumActive
      ? await buildPremiumExplanations(reviewItems)
      : reviewItems.map((item) => ({
          questionId: item.questionId,
          explanation: null,
        }));

    const mergedReview = reviewItems.map((item) => ({
      ...item,
      explanation:
        explanations.find((e) => e.questionId === item.questionId)?.explanation ??
        item.explanation ??
        null,
    }));

    const displayName =
      safeDisplayNameFromEmail(sessionUser?.email || attempt.email || null);

    const challengeUrl = buildChallengeUrl(req, displayName, score, total);
    const share = buildShareLinks(challengeUrl, displayName, score, total);

    return NextResponse.json({
      ok: true,
      attemptId: attempt.id,
      shareId,
      score,
      total,
      premiumExplanationsIncluded: premiumActive,
      review: mergedReview,
      share,
      redirectTo: `/biblequiz/results/${shareId}`,
    });
  } catch (err: any) {
    console.error("POST /api/quiz/submit error:", err);

    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to submit quiz." },
      { status: 500 }
    );
  }
}