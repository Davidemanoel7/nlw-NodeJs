/*
  Warnings:

  - You are about to drop the column `pollOpitionId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `PollOpition` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pollOptionId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PollOpition" DROP CONSTRAINT "PollOpition_pollId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pollOpitionId_fkey";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "pollOpitionId",
ADD COLUMN     "pollOptionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "PollOpition";

-- CreateTable
CREATE TABLE "PollOption" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollOptionId_fkey" FOREIGN KEY ("pollOptionId") REFERENCES "PollOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
