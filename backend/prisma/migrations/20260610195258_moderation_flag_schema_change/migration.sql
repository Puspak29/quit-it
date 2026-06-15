-- CreateEnum
CREATE TYPE "FlagSource" AS ENUM ('SYSTEM', 'USER');

-- DropForeignKey
ALTER TABLE "ModerationFlag" DROP CONSTRAINT "ModerationFlag_flaggedBy_fkey";

-- AlterTable
ALTER TABLE "ModerationFlag" ADD COLUMN     "flagSource" "FlagSource" NOT NULL DEFAULT 'SYSTEM',
ALTER COLUMN "flaggedBy" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ModerationFlag_flagSource_idx" ON "ModerationFlag"("flagSource");

-- AddForeignKey
ALTER TABLE "ModerationFlag" ADD CONSTRAINT "ModerationFlag_flaggedBy_fkey" FOREIGN KEY ("flaggedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
