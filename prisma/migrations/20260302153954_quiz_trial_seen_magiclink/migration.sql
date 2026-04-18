-- AlterTable
ALTER TABLE "public"."QuizAttempt" ADD COLUMN     "actorKey" TEXT;

-- CreateTable
CREATE TABLE "public"."QuizSeenQuestion" (
    "id" TEXT NOT NULL,
    "actorKey" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizSeenQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MagicLinkToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagicLinkToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizSeenQuestion_actorKey_idx" ON "public"."QuizSeenQuestion"("actorKey");

-- CreateIndex
CREATE INDEX "QuizSeenQuestion_category_idx" ON "public"."QuizSeenQuestion"("category");

-- CreateIndex
CREATE INDEX "QuizSeenQuestion_actorKey_category_createdAt_idx" ON "public"."QuizSeenQuestion"("actorKey", "category", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "QuizSeenQuestion_actorKey_questionId_key" ON "public"."QuizSeenQuestion"("actorKey", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "MagicLinkToken_tokenHash_key" ON "public"."MagicLinkToken"("tokenHash");

-- CreateIndex
CREATE INDEX "MagicLinkToken_email_idx" ON "public"."MagicLinkToken"("email");

-- CreateIndex
CREATE INDEX "MagicLinkToken_expiresAt_idx" ON "public"."MagicLinkToken"("expiresAt");

-- CreateIndex
CREATE INDEX "Question_category_idx" ON "public"."Question"("category");

-- CreateIndex
CREATE INDEX "QuizAttempt_actorKey_idx" ON "public"."QuizAttempt"("actorKey");

-- CreateIndex
CREATE INDEX "QuizAttempt_email_idx" ON "public"."QuizAttempt"("email");

-- CreateIndex
CREATE INDEX "QuizAttempt_category_idx" ON "public"."QuizAttempt"("category");

-- CreateIndex
CREATE INDEX "QuizAttempt_createdAt_idx" ON "public"."QuizAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "QuizAttemptQuestion_attemptId_idx" ON "public"."QuizAttemptQuestion"("attemptId");

-- CreateIndex
CREATE INDEX "QuizAttemptQuestion_questionId_idx" ON "public"."QuizAttemptQuestion"("questionId");
