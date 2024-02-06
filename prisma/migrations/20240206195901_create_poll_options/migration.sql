-- CreateTable
CREATE TABLE "pollOpitions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "pollOpitions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pollOpitions" ADD CONSTRAINT "pollOpitions_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
