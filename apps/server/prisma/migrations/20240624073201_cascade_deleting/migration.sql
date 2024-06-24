-- DropForeignKey
ALTER TABLE "CallSchedule" DROP CONSTRAINT "CallSchedule_customerId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingSchedule" DROP CONSTRAINT "MeetingSchedule_customerId_fkey";

-- AddForeignKey
ALTER TABLE "CallSchedule" ADD CONSTRAINT "CallSchedule_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingSchedule" ADD CONSTRAINT "MeetingSchedule_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
