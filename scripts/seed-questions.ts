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
    total: 45,
    difficulty: "easy to medium, mixed across all difficulty levels",
    topic:
      "broad Bible knowledge spanning Old Testament (Genesis through Malachi), New Testament (Acts through Revelation), " +
      "the Psalms (authors, famous psalms, themes), Proverbs (wisdom sayings, authorship), the life of Jesus, " +
      "the Ten Commandments, major prophets and their messages, key miracles, famous verses, " +
      "and foundational Bible facts every Christian should know",
  },
  {
    category: "women",
    label: "Women of the Bible",
    total: 35,
    difficulty: "easy to medium",
    topic:
      "women in the Bible across both Testaments — Old Testament figures (Eve, Sarah, Rebekah, Rachel, Miriam, Deborah, Ruth, Naomi, " +
      "Hannah, Esther, Rahab, Abigail), New Testament women (Mary the mother of Jesus, Mary Magdalene, Martha, Lydia, Priscilla, " +
      "Dorcas, the Samaritan woman) — their stories, roles, relationships, faithfulness, and significance in God's plan",
  },
  {
    category: "parables",
    label: "Jesus' Parables",
    total: 30,
    difficulty: "easy to hard, mixed",
    topic:
      "every parable told by Jesus across the four Gospels (Matthew, Mark, Luke, John) — including the Prodigal Son, Good Samaritan, " +
      "Sower and the Seeds, Lost Sheep, Ten Virgins, Talents, Pearl of Great Price, Rich Man and Lazarus, Pharisee and Tax Collector, " +
      "and others — covering characters, meanings, which Gospel they appear in, and the spiritual lessons they teach",
  },
  {
    category: "theology",
    label: "Christian Theology",
    total: 40,
    difficulty: "medium to hard",
    topic:
      "Christian doctrine and biblical theology: the Trinity, salvation (justification, sanctification, glorification), " +
      "atonement, grace and faith, baptism and the Lord's Supper, the fruit of the Spirit, spiritual gifts, " +
      "Paul's letters (Romans, 1–2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1–2 Thessalonians, the Pastorals) " +
      "and their key themes, Christian living (prayer, fasting, forgiveness, love, service), eschatology, " +
      "the Great Commission, and foundational Christian terms and creeds",
  },
  {
    category: "history",
    label: "Church History",
    total: 35,
    difficulty: "medium to hard",
    topic:
      "church history from Pentecost through the present day: the early church fathers (Ignatius, Polycarp, Justin Martyr, Irenaeus, " +
      "Augustine, Origen), the seven ecumenical councils, the Great Schism of 1054, the Crusades, monasticism, " +
      "the Protestant Reformation (Luther, Calvin, Zwingli, Knox, Tyndale, the 95 Theses), " +
      "the Council of Trent and Counter-Reformation, the Anabaptists, the Great Awakenings, " +
      "key missionaries (William Carey, Hudson Taylor, Amy Carmichael), and pivotal moments in 20th-century Christianity",
  },
  {
    category: "ai",
    label: "AI Bible Questions",
    total: 40,
    difficulty: "medium to hard — deeper comprehension and cross-reference questions",
    topic:
      "thought-provoking questions that test deeper Bible knowledge: connections between Old and New Testament passages, " +
      "typology and foreshadowing (Adam as a type of Christ, the Passover lamb, the bronze serpent), " +
      "Paul's letters in depth (specific verses, arguments, recipients, themes in Romans and Galatians), " +
      "Gospel parallels and differences between Matthew/Mark/Luke/John, " +
      "Hebrew and Greek word meanings behind key concepts, " +
      "lesser-known Bible characters and stories, numbers and symbols in Revelation, " +
      "and questions that require synthesising multiple passages to answer correctly",
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
  const existing = await withDbRetry(() =>
    db.question.findMany({
      where: { category: spec.category },
      select: { prompt: true },
    })
  );
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

// Retry wrapper for transient Neon cold-start / connection errors
async function withDbRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      await db.$queryRaw`SELECT 1`;
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const msg = err?.message ?? "";
      const retryable =
        msg.includes("Can't reach database") ||
        msg.includes("Connection refused") ||
        msg.includes("P1001") ||
        msg.includes("closed");
      if (!retryable || i === attempts - 1) throw err;
      console.log(`  ↻ DB connection lost — retrying in 3s (attempt ${i + 2}/${attempts})`);
      await sleep(3000);
    }
  }
  throw lastErr;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is not set. Check your .env or .env.local file.");
    process.exit(1);
  }

  console.log(`\n🤖 Generating Bible quiz questions with ${MODEL}...\n`);

  let totalInserted = 0;

  for (const spec of SPECS) {
    const questions = await generateForSpec(spec);

    if (questions.length === 0) continue;

    console.log(`\n  💾 Inserting ${questions.length} new ${spec.label} questions...`);

    await withDbRetry(() =>
      db.question.createMany({
        data: questions.map((q) => ({
          category: spec.category,
          prompt: q.prompt.trim(),
          optionA: q.optionA.trim(),
          optionB: q.optionB.trim(),
          optionC: q.optionC.trim(),
          optionD: q.optionD.trim(),
          answer: q.answer,
          explanation: q.explanation?.trim() ?? null,
        })),
        skipDuplicates: true,
      })
    );

    totalInserted += questions.length;
    console.log(`  ✓ Inserted. Running total: ${totalInserted} new questions.`);
  }

  const totals = await withDbRetry(() =>
    db.question.groupBy({ by: ["category"], _count: { id: true } })
  );
  const grandTotal = await withDbRetry(() => db.question.count());

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
