-- CreateTable
CREATE TABLE "public"."BibleSearchCache" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "bibleId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleSearchCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BibleSearchCache_cacheKey_key" ON "public"."BibleSearchCache"("cacheKey");

-- CreateIndex
CREATE INDEX "BibleSearchCache_bibleId_idx" ON "public"."BibleSearchCache"("bibleId");

-- CreateIndex
CREATE INDEX "BibleSearchCache_createdAt_idx" ON "public"."BibleSearchCache"("createdAt");
