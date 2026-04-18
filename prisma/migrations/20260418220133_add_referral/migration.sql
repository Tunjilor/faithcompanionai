-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referredBy" TEXT;

-- CreateIndex
CREATE INDEX "User_referredBy_idx" ON "User"("referredBy");
