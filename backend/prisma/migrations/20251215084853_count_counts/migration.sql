/*
  Warnings:

  - You are about to drop the `Count` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Count";

-- CreateTable
CREATE TABLE "counts" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "spacesCreated" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "counts_pkey" PRIMARY KEY ("id")
);
