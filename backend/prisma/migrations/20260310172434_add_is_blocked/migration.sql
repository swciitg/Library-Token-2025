/*
  Warnings:

  - A unique constraint covering the columns `[roll_no]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Student" (
    "roll_no" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("roll_no")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_roll_no_key" ON "Entry"("roll_no");
