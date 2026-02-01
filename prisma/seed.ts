// prisma/seed.ts
import { db } from "../src/lib/prisma";

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

// <-- keep your big questions array exactly as-is -->
const questions: Q[] = [
  // ...
];

async function main() {
  console.log("🌱 Seeding questions...");

  await db.quizAttemptQuestion.deleteMany();
  await db.quizAttempt.deleteMany();
  await db.question.deleteMany();

  await db.question.createMany({
    data: questions,
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
