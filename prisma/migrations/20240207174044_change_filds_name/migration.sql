/*
  Warnings:

  - You are about to drop the column `pollOpitionsId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `poll` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pollOpitions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pollOpitionId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pollId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pollOpitionsId_fkey";

-- DropForeignKey
ALTER TABLE "pollOpitions" DROP CONSTRAINT "pollOpitions_pollId_fkey";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "pollOpitionsId",
ADD COLUMN     "pollOpitionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "poll";

-- DropTable
DROP TABLE "pollOpitions";

-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollOpition" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "PollOpition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PollOpition" ADD CONSTRAINT "PollOpition_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollOpitionId_fkey" FOREIGN KEY ("pollOpitionId") REFERENCES "PollOpition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
