-- CreateTable
CREATE TABLE "public"."AiUsage" (
    "id" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL,
    "userKey" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiUsage_dayKey_idx" ON "public"."AiUsage"("dayKey");

-- CreateIndex
CREATE UNIQUE INDEX "AiUsage_dayKey_userKey_key" ON "public"."AiUsage"("dayKey", "userKey");
