// prisma/seed.ts
import { db } from "@/lib/prisma";

type Q = {
  category: string;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: "A" | "B" | "C" | "D";
  explanation?: string;
};

const questions: Q[] = [
  // (keep your questions exactly as-is)
  {
    category: "Bible Basics",
    prompt: "In the beginning, God created the ____ and the earth.",
    optionA: "sun",
    optionB: "heavens",
    optionC: "sea",
    optionD: "stars",
    answer: "B",
    explanation: "Genesis 1:1 — 'the heavens and the earth.'",
  },
  // ... keep the rest of your questions ...
];

async function main() {
  console.log("🌱 Seeding questions...");

  // Wipe only quiz tables (order matters because of foreign keys)
  await db.quizAttemptQuestion.deleteMany();
  await db.quizAttempt.deleteMany();
  await db.question.deleteMany();

  await db.question.createMany({
    data: questions,
    // skipDuplicates: true, // optional: only works if you have unique constraints
  });

  const count = await db.question.count();
  console.log(`✅ Seed complete. Inserted ${count} questions.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
