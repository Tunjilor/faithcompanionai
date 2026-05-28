// src/app/biblequiz/results/[shareId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { isPremiumUser } from "@/lib/premium";
import ShareButtons from "./share-buttons";
import LeaderboardBlock from "@/components/quiz/LeaderboardBlock";
import EmailCaptureBanner from "@/components/EmailCaptureBanner";
import QuizUpgradeNudge from "@/components/QuizUpgradeNudge";
import MobileInstallBanner from "@/components/MobileInstallBanner";

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
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function pct(score: number, total: number) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

type ResultTier = {
  label: string;
  meaning: string;
  encouragement: string;
  steps: string[];
};

function getResultTier(percent: number): ResultTier {
  if (percent >= 90) return {
    label: "Bible Scholar",
    meaning: "You have a deep, well-rounded knowledge of Scripture. This score reflects someone who spends consistent time in God's Word and takes their faith seriously.",
    encouragement: "That kind of depth doesn't happen by accident — it's the fruit of real commitment. You're an encouragement to those around you, whether you realise it or not. Keep going deeper.",
    steps: [
      "Explore a new book of the Bible you rarely visit",
      "Use the Devotional tool to reflect on a passage you know well but want to understand more deeply",
      "Share what you're learning — your insight could be exactly what someone else needs",
    ],
  };
  if (percent >= 70) return {
    label: "Growing Believer",
    meaning: "You have a solid foundation in Scripture and a genuine desire to grow. This score shows real engagement with the Bible — you're building something meaningful.",
    encouragement: "You're not just collecting knowledge — you're in motion. Faith is a journey, and you're clearly walking it with intention. Every question you got wrong is just the next thing to discover.",
    steps: [
      "Revisit the questions you missed and spend a few minutes reading the surrounding passage",
      "Try the Verse tool daily for a week — let Scripture speak to where you are right now",
      "Consider going premium to unlock deeper devotionals and save your journey",
    ],
  };
  if (percent >= 50) return {
    label: "Faithful Seeker",
    meaning: "You're somewhere in the middle — and that's exactly where growth happens. This score reflects honest engagement with Scripture, even where there are gaps.",
    encouragement: "Nobody starts as a scholar. The fact that you showed up, answered every question, and are reading this means something. Your curiosity about God's Word is the most important thing — that's what opens everything else.",
    steps: [
      "Pick one Bible topic that came up in the quiz and read about it this week",
      "Use the Prayer tool to ask God to give you hunger for His Word",
      "Take another quiz in a different category — each one builds your foundation",
    ],
  };
  return {
    label: "Earnest Beginner",
    meaning: "You're at the start of something. This score reflects where you are right now — not where you're going. Every person who knows the Bible well once stood exactly here.",
    encouragement: "Beginning is the hardest part, and you did it. God meets people at every level of knowledge — what matters is the open heart, not the score. You have everything you need to grow from here.",
    steps: [
      "Start with the Gospel of John — it's one of the most accessible books in the Bible",
      "Use the Verse tool to receive daily Scripture matched to what you're going through",
      "Come back and take this quiz again in two weeks — you'll be surprised how much changes",
    ],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const shareId = String(params.shareId || "").trim();
  const attempt = await db.quizAttempt.findFirst({
    where: { shareId },
    select: { category: true, score: true, total: true },
  });
  if (!attempt) {
    return { title: "Quiz Results", description: "Quiz results not found.", robots: { index: false, follow: false } };
  }
  const scoreText = `${attempt.score}/${attempt.total} (${pct(attempt.score, attempt.total)}%)`;
  const categoryName = titleCase(attempt.category || "general");
  const urlPath = `/biblequiz/results/${shareId}`;
  const ogImage = `https://faithcompanionai.com/api/og/quiz-results/${shareId}`;
  return {
    title: `Bible Quiz Results - ${scoreText}`,
    description: `Category: ${categoryName}. Score: ${scoreText}.`,
    alternates: { canonical: urlPath },
    openGraph: {
      title: `Bible Quiz Results - ${scoreText}`,
      description: `Category: ${categoryName}. Can your friends beat this score?`,
      url: `https://faithcompanionai.com${urlPath}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Bible quiz score ${scoreText}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Bible Quiz Results - ${scoreText}`,
      description: `Category: ${categoryName}. Can your friends beat this score?`,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const shareId = String(params.shareId || "").trim();
  if (!shareId) return notFound();

  const dbTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
  const attempt = (await Promise.race([
    db.quizAttempt.findFirst({
      where: { shareId },
      include: {
        questions: {
          include: { question: true },
          orderBy: { id: "asc" },
        },
      },
    }),
    dbTimeout,
  ])) as AttemptWithQuestions | null;

  if (!attempt) return notFound();

  const userIsPremium = await isPremiumUser();

  const categoryName = titleCase(attempt.category || "general");
  let correctCount = 0;
  attempt.questions.forEach((aq: AttemptWithQuestions["questions"][number]) => {
    if (aq.chosen && aq.chosen === aq.question.answer) correctCount++;
  });

  const total = attempt.questions.length || attempt.total || 0;
  const percent = total ? Math.round((correctCount / total) * 100) : 0;
  const scoreText = `${correctCount}/${total}`;
  const tier = getResultTier(percent);
  const shareUrl = `https://faithcompanionai.com/biblequiz/results/${shareId}`;
  const shareText = `I just took a Bible quiz and got "${tier.label}" (${percent}%).\nIt revealed something about my faith journey I didn't expect.\n\nCan you beat my score? Take the quiz:`;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-16 pt-8 md:px-6">
      <section className="rounded-3xl bg-gradient-to-r from-purple-600 to-orange-500 p-[1px]">
        <div className="rounded-3xl bg-black/35 px-6 py-10 text-center backdrop-blur">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">Quiz Results</h1>
          <p className="mt-2 text-white/80">Share your score + review answers</p>
        </div>
      </section>

      <div className="fc-surface rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm text-white/70">Category</div>
            <div className="text-xl font-bold text-white">{categoryName}</div>
            <div className="mt-1 text-xs text-white/50">Completed: {attempt.createdAt.toLocaleString()}</div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-sm text-white/70">Score</div>
            <div className="text-3xl font-extrabold text-white">{scoreText}</div>
            <div className="text-sm text-white/70">{percent}%</div>
          </div>
        </div>
        <div className="mt-6">
          <ShareButtons shareUrl={shareUrl} shareText={shareText} tierLabel={tier.label} />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/biblequiz" className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-center text-sm font-semibold text-white hover:opacity-95">
            Take Another Quiz
          </Link>
          <Link href="/pricing" className="rounded-md border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white">
            Go Premium
          </Link>
        </div>
      </div>

      {/* Result meaning + emotional support + next steps + CTA */}
      {(() => {
        return (
          <>
            <section className="fc-surface rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="inline-flex rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-1 text-xs font-bold text-white">
                {tier.label}
              </div>
              <h2 className="text-xl font-extrabold text-white">What this result means</h2>
              <p className="text-sm leading-7 text-white/75">{tier.meaning}</p>
              <p className="text-sm leading-7 text-white/75">{tier.encouragement}</p>
            </section>

            <section className="fc-surface rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-extrabold text-white mb-4">What to do next</h2>
              <ol className="space-y-3">
                {tier.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-orange-500 text-xs font-extrabold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-7 text-white/80">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-col items-center gap-3">
                <Link
                  href="/tools/devotional"
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95 sm:max-w-sm"
                >
                  Get Personalized Guidance
                </Link>
                <p className="text-xs text-white/45">
                  Want to go deeper?{" "}
                  <Link href="/pricing" className="text-white/65 underline underline-offset-2 hover:text-white/90 transition">
                    Unlock Your Faith Journey
                  </Link>
                </p>
              </div>

              <MobileInstallBanner />
            </section>
          </>
        );
      })()}

      <section className="fc-surface rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <h2 className="text-xl font-extrabold text-white">Go deeper in your faith journey</h2>
        <p className="text-sm text-white/70 max-w-md mx-auto">
          Unlock personalized devotionals, unlimited guidance, and saved progress.
        </p>
        <Link
          href="/pricing"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition"
        >
          Unlock Your Faith Journey
        </Link>
      </section>

      <QuizUpgradeNudge />
      {!attempt.userId && <EmailCaptureBanner />}

      <LeaderboardBlock category={attempt.category} currentShareId={shareId} title="Can anyone beat this score?" />

      {userIsPremium ? (
        <section className="space-y-4">
          <div className="text-xl font-extrabold text-white">Review</div>
          {attempt.questions.map((aq: AttemptWithQuestions["questions"][number], i: number) => {
            const q = aq.question;
            const chosen = (aq.chosen ?? null) as Choice | null;
            const correct = (q.answer ?? null) as Choice | null;
            const isCorrect = !!chosen && !!correct && chosen === correct;
            const chosenText = chosen === "A" ? q.optionA : chosen === "B" ? q.optionB : chosen === "C" ? q.optionC : chosen === "D" ? q.optionD : null;
            const correctText = correct === "A" ? q.optionA : correct === "B" ? q.optionB : correct === "C" ? q.optionC : correct === "D" ? q.optionD : null;
            return (
              <div key={aq.id} className={`rounded-2xl border p-5 ${chosen ? isCorrect ? "border-green-500/60 bg-green-900/15" : "border-red-500/60 bg-red-900/15" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="font-semibold text-white">{i + 1}. {q.prompt}</div>
                  <div className="text-xs font-bold">
                    {chosen ? isCorrect ? <span className="text-green-400">Correct</span> : <span className="text-red-400">Incorrect</span> : <span className="text-white/50">Not answered</span>}
                  </div>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="text-white/80">Your answer: <span className={chosen ? isCorrect ? "text-green-300" : "text-red-300" : "text-white/50"}>{chosen ? `${chosen}. ${chosenText}` : "-"}</span></div>
                  <div className="text-white/80">Correct answer: <span className="text-green-300">{correct ? `${correct}. ${correctText}` : "-"}</span></div>
                  {q.explanation ? <div className="mt-2 text-xs text-white/70"><span className="font-semibold text-white/80">Explanation: </span>{q.explanation}</div> : null}
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center space-y-4">
          <div className="text-2xl">🔒</div>
          <h2 className="text-xl font-extrabold text-white">Answer Review is a Premium Feature</h2>
          <p className="text-sm leading-7 text-amber-200/80 max-w-md mx-auto">
            See exactly which questions you missed, what the correct answers were, and get
            detailed explanations for every question. Upgrade to unlock the full review.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/pricing"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-8 py-3 text-sm font-semibold text-white hover:opacity-95 transition"
            >
              Upgrade to Premium
            </Link>
            <Link
              href="/biblequiz"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Take Another Quiz
            </Link>
          </div>
          <p className="text-xs text-white/40">
            Your score and progress are saved — upgrade any time to review past results.
          </p>
        </section>
      )}
    </main>
  );
}