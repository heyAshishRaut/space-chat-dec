-- CreateTable
CREATE TABLE "Count" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "spacesCreated" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Count_pkey" PRIMARY KEY ("id")
);
