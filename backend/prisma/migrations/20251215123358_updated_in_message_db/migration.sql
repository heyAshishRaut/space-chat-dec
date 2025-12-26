/*
  Warnings:

  - Added the required column `firstName` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likes` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "image" JSONB,
ADD COLUMN     "likes" INTEGER NOT NULL;
