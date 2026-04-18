// scripts/seed-questions.ts
// Run with: npx tsx scripts/seed-questions.ts
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({ log: ["error"] });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const BATCH_SIZE = 10;

interface RawQuestion {
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: "A" | "B" | "C" | "D";
  explanation: string;
}

interface BatchSpec {
  category: string;
  label: string;
  total: number;
  difficulty: string;
  topic: string;
}

const SPECS: BatchSpec[] = [
  {
    category: "general",
    label: "General Bible Knowledge",
    total: 25,
    difficulty: "easy to medium",
    topic:
      "broad Bible knowledge including key people, places, events, books, and verses from both Old and New Testaments",
  },
  {
    category: "women",
    label: "Women of the Bible",
    total: 20,
    difficulty: "easy to medium",
    topic:
      "women in the Bible — their stories, roles, relationships, and significance in Scripture",
  },
  {
    category: "parables",
    label: "Jesus' Parables",
    total: 15,
    difficulty: "medium",
    topic:
      "parables told by Jesus — their content, characters, meaning, and the passages they appear in",
  },
  {
    category: "theology",
    label: "Christian Theology",
    total: 15,
    difficulty: "medium to hard",
    topic:
      "Christian doctrine including the Trinity, salvation, atonement, sanctification, ecclesiology, eschatology, and key theological terms",
  },
  {
    category: "history",
    label: "Church History",
    total: 15,
    difficulty: "medium to hard",
    topic:
      "church history from the early church through the Reformation and modern era — key figures, councils, movements, and dates",
  },
  {
    category: "ai",
    label: "AI Bible Questions",
    total: 10,
    difficulty: "medium",
    topic:
      "creative and thought-provoking Bible questions that test deeper comprehension — including connections between passages, symbolic meaning, and lesser-known biblical details",
  },
];

function buildPrompt(spec: BatchSpec, count: number, seen: string[]): string {
  const avoidSection =
    seen.length > 0
      ? `\n\nDo NOT repeat questions similar to these already generated:\n${seen
          .slice(-30)
          .map((q) => `- ${q}`)
          .join("\n")}`
      : "";

  return `Generate exactly ${count} Bible quiz questions about "${spec.label}".

Topic focus: ${spec.topic}
Difficulty: ${spec.difficulty}

Return ONLY a JSON object in this exact shape:
{
  "questions": [
    {
      "prompt": "The question text ending with a question mark?",
      "optionA": "First answer choice",
      "optionB": "Second answer choice",
      "optionC": "Third answer choice",
      "optionD": "Fourth answer choice",
      "answer": "B",
      "explanation": "One or two sentences explaining the correct answer, citing a Bible reference."
    }
  ]
}

Requirements:
- Every question must be factually accurate
- All four options must be plausible — avoid obviously wrong distractors
- The "answer" field must be exactly one of: A, B, C, or D
- Each explanation must cite at least one Bible book and verse where applicable
- No trick questions — test genuine knowledge
- Questions should be distinct from one another in what they test${avoidSection}`;
}

function isValidQuestion(q: unknown): q is RawQuestion {
  if (!q || typeof q !== "object") return false;
  const o = q as Record<string, unknown>;
  if (typeof o.prompt !== "string" || o.prompt.trim().length < 10) return false;
  if (typeof o.optionA !== "string" || o.optionA.trim().length < 2) return false;
  if (typeof o.optionB !== "string" || o.optionB.trim().length < 2) return false;
  if (typeof o.optionC !== "string" || o.optionC.trim().length < 2) return false;
  if (typeof o.optionD !== "string" || o.optionD.trim().length < 2) return false;
  if (!["A", "B", "C", "D"].includes(o.answer as string)) return false;
  return true;
}

function normalizePrompt(prompt: string): string {
  return prompt.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 80);
}

async function generateBatch(
  spec: BatchSpec,
  count: number,
  seenPrompts: string[]
): Promise<RawQuestion[]> {
  const prompt = buildPrompt(spec, count, seenPrompts);

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a Christian Bible scholar. You return accurate, well-structured quiz questions as valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.75,
  });

  const raw = response.choices[0]?.message?.content ?? "{}";

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn("    ⚠ Failed to parse JSON response, skipping batch.");
    return [];
  }

  const items: unknown[] = (parsed as any)?.questions ?? [];
  return items.filter(isValidQuestion);
}

async function generateForSpec(spec: BatchSpec): Promise<RawQuestion[]> {
  const results: RawQuestion[] = [];
  const seenNormalized = new Set<string>();

  // Fetch prompts already in the DB for this category to avoid duplicates
  const existing = await db.question.findMany({
    where: { category: spec.category },
    select: { prompt: true },
  });
  for (const q of existing) seenNormalized.add(normalizePrompt(q.prompt));

  console.log(
    `\n  [${spec.label}] need ${spec.total} questions (${existing.length} already in DB)`
  );

  const needed = spec.total - existing.length;
  if (needed <= 0) {
    console.log(`  ✓ Already has enough — skipping.`);
    return [];
  }

  let remaining = needed;
  let attempt = 0;
  const maxAttempts = Math.ceil(needed / BATCH_SIZE) + 3;

  while (remaining > 0 && attempt < maxAttempts) {
    attempt++;
    const batchSize = Math.min(BATCH_SIZE, remaining + 3); // ask a few extra to account for dupes
    const seenList = [...results, ...existing.map((q) => ({ prompt: q.prompt }))]
      .map((q) => q.prompt)
      .slice(-30);

    console.log(
      `  → Batch ${attempt}: requesting ${batchSize} questions (${remaining} still needed)`
    );

    let batch: RawQuestion[];
    try {
      batch = await generateBatch(spec, batchSize, seenList);
    } catch (err: any) {
      console.warn(`  ⚠ OpenAI error on batch ${attempt}: ${err?.message}`);
      if (attempt >= maxAttempts) break;
      await sleep(2000);
      continue;
    }

    let added = 0;
    for (const q of batch) {
      if (remaining <= 0) break;
      const key = normalizePrompt(q.prompt);
      if (seenNormalized.has(key)) continue;
      seenNormalized.add(key);
      results.push(q);
      remaining--;
      added++;
    }

    console.log(`     Got ${batch.length} back, accepted ${added} new (${remaining} remaining)`);

    if (added === 0 && attempt >= maxAttempts) {
      console.warn(`  ⚠ Could not generate enough unique questions for ${spec.label}.`);
      break;
    }

    if (remaining > 0) await sleep(800);
  }

  return results;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is not set. Check your .env or .env.local file.");
    process.exit(1);
  }

  console.log(`\n🤖 Generating Bible quiz questions with ${MODEL}...\n`);

  const allNew: Array<RawQuestion & { category: string }> = [];

  for (const spec of SPECS) {
    const questions = await generateForSpec(spec);
    for (const q of questions) {
      allNew.push({ ...q, category: spec.category });
    }
  }

  if (allNew.length === 0) {
    console.log("\nNo new questions to insert.");
    return;
  }

  console.log(`\n💾 Inserting ${allNew.length} new questions into the database...`);

  await db.question.createMany({
    data: allNew.map((q) => ({
      category: q.category,
      prompt: q.prompt.trim(),
      optionA: q.optionA.trim(),
      optionB: q.optionB.trim(),
      optionC: q.optionC.trim(),
      optionD: q.optionD.trim(),
      answer: q.answer,
      explanation: q.explanation?.trim() ?? null,
    })),
    skipDuplicates: true,
  });

  const totals = await db.question.groupBy({
    by: ["category"],
    _count: { id: true },
  });

  const grandTotal = await db.question.count();

  console.log("\n✅ Done! Questions now in database:\n");
  for (const row of totals.sort((a, b) => a.category.localeCompare(b.category))) {
    console.log(`   ${row.category.padEnd(12)}: ${row._count.id}`);
  }
  console.log(`   ${"TOTAL".padEnd(12)}: ${grandTotal}`);
}

main()
  .catch((err) => {
    console.error("\n❌ Script failed:", err?.message ?? err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
