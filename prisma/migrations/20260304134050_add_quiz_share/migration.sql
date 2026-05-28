/*
  Warnings:

  - A unique constraint covering the columns `[shareId]` on the table `QuizAttempt` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."QuizAttempt" ADD COLUMN     "shareId" TEXT,
ADD COLUMN     "sharedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."BiblePassageCache" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "bibleId" TEXT NOT NULL,
    "passageId" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BiblePassageCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BiblePassageCache_cacheKey_key" ON "public"."BiblePassageCache"("cacheKey");

-- CreateIndex
CREATE INDEX "BiblePassageCache_bibleId_idx" ON "public"."BiblePassageCache"("bibleId");

-- CreateIndex
CREATE INDEX "BiblePassageCache_createdAt_idx" ON "public"."BiblePassageCache"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "QuizAttempt_shareId_key" ON "public"."QuizAttempt"("shareId");

-- CreateIndex
CREATE INDEX "QuizAttempt_shareId_idx" ON "public"."QuizAttempt"("shareId");
