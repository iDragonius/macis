/*
  Warnings:

  - You are about to drop the column `reasonForRejection` on the `CallSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `reasonForRejection` on the `MeetingSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CallSchedule" DROP COLUMN "reasonForRejection";

-- AlterTable
ALTER TABLE "MeetingSchedule" DROP COLUMN "reasonForRejection";
