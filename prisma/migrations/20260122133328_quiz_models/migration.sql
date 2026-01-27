/*
  Warnings:

  - You are about to drop the column `choiceA` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `choiceB` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `choiceC` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `choiceD` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `isPremium` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `isPremiumUser` on the `QuizAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `QuizAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `QuizAttemptQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `selected` on the `QuizAttemptQuestion` table. All the data in the column will be lost.
  - Added the required column `optionA` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionB` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionC` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionD` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "QuizResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Question" ("answer", "category", "createdAt", "explanation", "id", "prompt") SELECT "answer", "category", "createdAt", "explanation", "id", "prompt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE TABLE "new_QuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "email" TEXT,
    "category" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 10,
    "timed" BOOLEAN NOT NULL DEFAULT false,
    "durationSeconds" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_QuizAttempt" ("category", "createdAt", "durationSeconds", "email", "id", "score", "timed", "total") SELECT "category", "createdAt", "durationSeconds", "email", "id", "score", "timed", "total" FROM "QuizAttempt";
DROP TABLE "QuizAttempt";
ALTER TABLE "new_QuizAttempt" RENAME TO "QuizAttempt";
CREATE TABLE "new_QuizAttemptQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "chosen" TEXT,
    "isCorrect" BOOLEAN,
    CONSTRAINT "QuizAttemptQuestion_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizAttemptQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QuizAttemptQuestion" ("attemptId", "id", "questionId") SELECT "attemptId", "id", "questionId" FROM "QuizAttemptQuestion";
DROP TABLE "QuizAttemptQuestion";
ALTER TABLE "new_QuizAttemptQuestion" RENAME TO "QuizAttemptQuestion";
CREATE UNIQUE INDEX "QuizAttemptQuestion_attemptId_questionId_key" ON "QuizAttemptQuestion"("attemptId", "questionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
