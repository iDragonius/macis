-- AlterTable
ALTER TABLE "CallSchedule" ADD COLUMN     "nextContactDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MeetingSchedule" ADD COLUMN     "meetingDate" TIMESTAMP(3),
ADD COLUMN     "nextContactDate" TIMESTAMP(3),
ADD COLUMN     "nextMeetingDate" TIMESTAMP(3),
ALTER COLUMN "meetingTime" SET DATA TYPE TEXT;
