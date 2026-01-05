import { db } from "@/lib/db";
import Link from "next/link";

export default async function ResultPage({ params }: { params: { id: string } }) {
  const r = await db.quizResult.findUnique({ where: { id: params.id } });
  if (!r) {
    return (
      <div className="fc-surface p-8">
        <h1 className="text-2xl font-extrabold text-white">Result not found</h1>
        <Link className="text-white/70 underline" href="/biblequiz">Back to Quiz</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="fc-surface p-8 text-center">
        <h1 className="text-3xl font-extrabold text-white">Quiz Result</h1>
        <p className="mt-2 text-white/70">Score</p>
        <div className="mt-3 text-5xl font-extrabold text-white">
          {r.score}/{r.total}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/biblequiz"
            className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white hover:opacity-95"
          >
            Take the Quiz
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            Go Premium
          </Link>
        </div>
      </div>
    </div>
  );
}
