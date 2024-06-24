/*
  Warnings:

  - Made the column `result` on table `MeetingSchedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CallSchedule" ALTER COLUMN "result" SET DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "MeetingSchedule" ALTER COLUMN "result" SET NOT NULL,
ALTER COLUMN "result" SET DEFAULT 'UNKNOWN';
