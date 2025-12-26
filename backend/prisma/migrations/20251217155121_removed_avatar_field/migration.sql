/*
  Warnings:

  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_email_fkey";

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "likedUser" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar";
