/*
  Warnings:

  - You are about to drop the column `roomCode` on the `spaces` table. All the data in the column will be lost.
  - You are about to drop the column `roomName` on the `spaces` table. All the data in the column will be lost.
  - Added the required column `spaceCode` to the `spaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceName` to the `spaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spaces" DROP COLUMN "roomCode",
DROP COLUMN "roomName",
ADD COLUMN     "spaceCode" TEXT NOT NULL,
ADD COLUMN     "spaceName" TEXT NOT NULL;
