/*
  Warnings:

  - You are about to drop the column `recieverId` on the `Messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_recieverId_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "recieverId",
ADD COLUMN     "groupId" INTEGER,
ADD COLUMN     "receiverId" INTEGER;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
