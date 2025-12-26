/*
  Warnings:

  - You are about to drop the column `userId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_spaceId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "spaceId";

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "spaceId" TEXT,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
