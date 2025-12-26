/*
  Warnings:

  - Made the column `spaceId` on table `members` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_spaceId_fkey";

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "spaceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
