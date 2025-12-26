/*
  Warnings:

  - You are about to drop the column `attachments` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `likedUser` on the `messages` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'image', 'file');

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "attachments",
DROP COLUMN "likedUser",
ADD COLUMN     "file" TEXT,
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'text',
ALTER COLUMN "text" DROP NOT NULL,
ALTER COLUMN "likes" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_messageId_userEmail_key" ON "likes"("messageId", "userEmail");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
