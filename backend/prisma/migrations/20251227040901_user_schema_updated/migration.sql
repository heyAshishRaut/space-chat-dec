-- AlterTable
ALTER TABLE "users" ALTER COLUMN "refreshToken" DROP NOT NULL,
ALTER COLUMN "emailVerificationToken" DROP NOT NULL,
ALTER COLUMN "emailVerificationExpiry" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "messages_spaceId_idx" ON "messages"("spaceId");
