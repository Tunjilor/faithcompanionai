import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readPremiumToken } from "@/lib/premium-cookie";

type CategoryId = "ai" | "theology" | "history";
type Question = { q: string; options: string[]; answer: number };

function stubQuestions(category: CategoryId, count: number): Question[] {
  const topic =
    category === "ai"
      ? "Bible knowledge"
      : category === "theology"
      ? "Christian theology"
      : "Church history";

  const out: Question[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      q: `[STUB] ${topic} question ${i + 1}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: i % 4,
    });
  }
  return out;
}

export async function GET(req: Request) {
  const token = (await cookies()).get("fca_premium")?.value;
  const payload = readPremiumToken(token);

  if (!payload?.premium) {
    return NextResponse.json({ error: "premium_required" }, { status: 403 });
  }

  const url = new URL(req.url);
  const category = (url.searchParams.get("category") || "ai") as CategoryId;
  const count = Math.min(20, Math.max(5, Number(url.searchParams.get("count") || 10)));

  // TODO: Replace this stub with OpenAI generation later.
  // IMPORTANT: Even when you connect OpenAI, keep the premium check above.
  const questions = stubQuestions(category, count);

  return NextResponse.json({ questions });
}
