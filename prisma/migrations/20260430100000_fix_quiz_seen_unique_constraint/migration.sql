-- DropIndex
DROP INDEX "public"."QuizSeenQuestion_actorKey_questionId_key";

-- CreateIndex
CREATE UNIQUE INDEX "QuizSeenQuestion_actorKey_category_questionId_key" ON "public"."QuizSeenQuestion"("actorKey", "category", "questionId");
