// src/lib/quiz-generate.ts
import OpenAI from "openai";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export type GeneratedQuestion = {
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: "A" | "B" | "C" | "D";
  explanation: string;
};

const CATEGORY_SPECS: Record<string, { label: string; topic: string; difficulty: string }> = {
  general: {
    label: "General Bible Knowledge",
    difficulty: "easy to medium, mixed across all difficulty levels",
    topic:
      "broad Bible knowledge spanning Old Testament (Genesis through Malachi), New Testament (Acts through Revelation), " +
      "the Psalms (authors, famous psalms, themes), Proverbs (wisdom sayings, authorship), the life of Jesus, " +
      "the Ten Commandments, major prophets and their messages, key miracles, famous verses, " +
      "and foundational Bible facts every Christian should know",
  },
  women: {
    label: "Women of the Bible",
    difficulty: "easy to medium",
    topic:
      "women in the Bible across both Testaments — Old Testament figures (Eve, Sarah, Rebekah, Rachel, Miriam, Deborah, Ruth, Naomi, " +
      "Hannah, Esther, Rahab, Abigail), New Testament women (Mary the mother of Jesus, Mary Magdalene, Martha, Lydia, Priscilla, " +
      "Dorcas, the Samaritan woman) — their stories, roles, relationships, faithfulness, and significance in God's plan",
  },
  parables: {
    label: "Jesus' Parables",
    difficulty: "easy to hard, mixed",
    topic:
      "every parable told by Jesus across the four Gospels (Matthew, Mark, Luke, John) — including the Prodigal Son, Good Samaritan, " +
      "Sower and the Seeds, Lost Sheep, Ten Virgins, Talents, Pearl of Great Price, Rich Man and Lazarus, Pharisee and Tax Collector, " +
      "and others — covering characters, meanings, which Gospel they appear in, and the spiritual lessons they teach",
  },
  theology: {
    label: "Christian Theology",
    difficulty: "medium to hard",
    topic:
      "Christian doctrine and biblical theology: the Trinity, salvation (justification, sanctification, glorification), " +
      "atonement, grace and faith, baptism and the Lord\'s Supper, the fruit of the Spirit, spiritual gifts, " +
      "Paul\'s letters (Romans, 1-2 Corinthians, Galatians, Ephesians, Philippians, Colossians, 1-2 Thessalonians, the Pastorals) " +
      "and their key themes, Christian living (prayer, fasting, forgiveness, love, service), eschatology, " +
      "the Great Commission, and foundational Christian terms and creeds",
  },
  history: {
    label: "Church History",
    difficulty: "medium to hard",
    topic:
      "church history from Pentecost through the present day: the early church fathers (Ignatius, Polycarp, Justin Martyr, Irenaeus, " +
      "Augustine, Origen), the seven ecumenical councils, the Great Schism of 1054, the Crusades, monasticism, " +
      "the Protestant Reformation (Luther, Calvin, Zwingli, Knox, Tyndale, the 95 Theses), " +
      "the Council of Trent and Counter-Reformation, the Anabaptists, the Great Awakenings, " +
      "key missionaries (William Carey, Hudson Taylor, Amy Carmichael), and pivotal moments in 20th-century Christianity",
  },
  ai: {
    label: "AI Bible Questions",
    difficulty: "medium to hard — deeper comprehension and cross-reference questions",
    topic:
      "thought-provoking questions that test deeper Bible knowledge: connections between Old and New Testament passages, " +
      "typology and foreshadowing (Adam as a type of Christ, the Passover lamb, the bronze serpent), " +
      "Paul\'s letters in depth (specific verses, arguments, recipients, themes in Romans and Galatians), " +
      "Gospel parallels and differences between Matthew/Mark/Luke/John, " +
      "Hebrew and Greek word meanings behind key concepts, " +
      "lesser-known Bible characters and stories, numbers and symbols in Revelation, " +
      "and questions that require synthesising multiple passages to answer correctly",
  },
};

function buildPrompt(category: string, count: number, avoidPrompts: string[]): string {
  const spec = CATEGORY_SPECS[category]!;
  const avoidSection =
    avoidPrompts.length > 0
      ? `\n\nDo NOT repeat questions similar to these already in use:\n${avoidPrompts
          .slice(-30)
          .map((q) => `- ${q}`)
          .join("\n")}`
      : "";

  return `Generate exactly ${count} Bible quiz question${count !== 1 ? "s" : ""} about "${spec.label}".

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

function isValidQuestion(q: unknown): q is GeneratedQuestion {
  if (!q || typeof q !== "object") return false;
  const o = q as Record<string, unknown>;
  return (
    typeof o.prompt === "string" &&
    o.prompt.trim().length >= 10 &&
    typeof o.optionA === "string" &&
    o.optionA.trim().length >= 2 &&
    typeof o.optionB === "string" &&
    o.optionB.trim().length >= 2 &&
    typeof o.optionC === "string" &&
    o.optionC.trim().length >= 2 &&
    typeof o.optionD === "string" &&
    o.optionD.trim().length >= 2 &&
    ["A", "B", "C", "D"].includes(o.answer as string)
  );
}

export function supportsGeneration(category: string): boolean {
  return category in CATEGORY_SPECS;
}

/**
 * Calls OpenAI to generate `count` quiz questions for `category`.
 * Pass `avoidPrompts` to reduce near-duplicate generation.
 * Throws if OPENAI_API_KEY is not set or the API call fails.
 */
export async function generateQuizQuestions(
  category: string,
  count: number,
  avoidPrompts: string[]
): Promise<GeneratedQuestion[]> {
  if (!supportsGeneration(category) || count <= 0) return [];

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const openai = new OpenAI({ apiKey, timeout: 20_000 });

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a Christian Bible scholar. Return accurate, well-structured quiz questions as valid JSON only.",
      },
      { role: "user", content: buildPrompt(category, count, avoidPrompts) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.75,
  });

  const raw = response.choices[0]?.message?.content ?? "{}";

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  const items: unknown[] = (parsed as any)?.questions ?? [];
  return items.filter(isValidQuestion);
}
