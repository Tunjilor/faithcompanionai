-- DropIndex
DROP INDEX "public"."MagicLinkToken_expiresAt_idx";

-- CreateIndex
CREATE INDEX "QuizAttempt_actorKey_category_createdAt_idx" ON "public"."QuizAttempt"("actorKey", "category", "createdAt");
