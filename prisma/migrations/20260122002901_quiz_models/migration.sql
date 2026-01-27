-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "choiceA" TEXT NOT NULL,
    "choiceB" TEXT NOT NULL,
    "choiceC" TEXT NOT NULL,
    "choiceD" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "sessionId" TEXT,
    "isPremiumUser" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "timed" BOOLEAN NOT NULL DEFAULT false,
    "durationSeconds" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "QuizAttemptQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selected" TEXT,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "QuizAttemptQuestion_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizAttemptQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "QuizAttempt_email_createdAt_idx" ON "QuizAttempt"("email", "createdAt");

-- CreateIndex
CREATE INDEX "QuizAttempt_sessionId_createdAt_idx" ON "QuizAttempt"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "QuizAttemptQuestion_attemptId_idx" ON "QuizAttemptQuestion"("attemptId");

-- CreateIndex
CREATE INDEX "QuizAttemptQuestion_questionId_idx" ON "QuizAttemptQuestion"("questionId");
