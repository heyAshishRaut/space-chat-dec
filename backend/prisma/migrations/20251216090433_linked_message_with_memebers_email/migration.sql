/*
  Warnings:

  - You are about to drop the column `image` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "image",
ADD COLUMN     "attachments" JSONB;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_email_fkey" FOREIGN KEY ("email") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
