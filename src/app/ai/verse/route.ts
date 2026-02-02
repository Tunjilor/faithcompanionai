import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getOpenAI } from "@/lib/ai/openai";
import { sha256 } from "@/lib/ai/hash";
import { dayKeyUTC } from "@/lib/verse/pick-daily";
import { getUserKeyMaybeEmail } from "@/lib/auth/user-key";

export const runtime = "nodejs";

type Kind = "explain" | "devotional" | "qa";

function buildPrompt(args: {
  kind: Kind;
  reference: string;
  verseText: string;
  question?: string;
}) {
  const base = `You are FaithCompanionAI.
Be biblically respectful and doctrinally neutral.
Do not claim new revelation. Avoid stating denominations are correct/incorrect.
Use clear, modern English.

Scripture (WEB):
${args.reference}
"${args.verseText}"`;

  if (args.kind === "explain") {
    return `${base}

Task: Explain the verse plainly for a general Christian audience.
Include:
- 3–6 sentence explanation
- 3 practical takeaways (bullets)
- 1 short prayer (2–3 sentences)`;
  }

  if (args.kind === "devotional") {
    return `${base}

Task: Write a short devotional (150–250 words) based on the verse.
Include:
- Title
- Reflection
- One action step
- Short closing prayer`;
  }

  // qa
  return `${base}

User question: ${args.question || ""}

Task: Answer using Scripture first. If uncertain, say so.
Keep it under 180 words.`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const kind = body?.kind as Kind;
  const reference = String(body?.reference || "");
  const verseText = String(body?.verseText || "");
  const question = body?.question ? String(body.question) : undefined;

  if (!kind || !reference || !verseText) {
    return NextResponse.json({ error: "Missing kind/reference/verseText" }, { status: 400 });
  }

  const { userKey } = getUserKeyMaybeEmail();
  const dayKey = dayKeyUTC();

  // Free daily limit: 10/day per userKey
  // (Later, when your premium auth is wired, you can skip this for premium users.)
  const usage = await db.aiUsage.upsert({
    where: { dayKey_userKey: { dayKey, userKey } },
    update: { count: { increment: 1 } },
    create: { dayKey, userKey, count: 1 },
  });

  if (usage.count > 10) {
    return NextResponse.json(
      { error: "Daily free limit reached (10/day). Please upgrade for unlimited." },
      { status: 429 }
    );
  }

  const inputJson = JSON.stringify({ kind, reference, verseText, question });
  const cacheKey = sha256(inputJson);

  const cached = await db.aiCache.findUnique({ where: { cacheKey } });
  if (cached) {
    return NextResponse.json({ cached: true, output: cached.outputText });
  }

  const prompt = buildPrompt({ kind, reference, verseText, question });

  const client = getOpenAI();

  // Using Responses API style
  const resp = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  const output =
    resp.output_text?.trim?.() ||
    // fallback if SDK shape changes
    (resp as any)?.output?.[0]?.content?.[0]?.text?.trim?.() ||
    "";

  if (!output) {
    return NextResponse.json({ error: "Empty AI output" }, { status: 500 });
  }

  await db.aiCache.create({
    data: {
      cacheKey,
      kind,
      translation: "WEB",
      reference,
      inputJson,
      outputText: output,
    },
  });

  return NextResponse.json({ cached: false, output });
}
