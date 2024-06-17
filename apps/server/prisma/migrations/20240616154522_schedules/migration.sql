-- CreateEnum
CREATE TYPE "MeetingResult" AS ENUM ('CONTRACT_SIGNED', 'WILL_BE_FOLLOWED', 'REFUSED');

-- CreateEnum
CREATE TYPE "CallResult" AS ENUM ('WILL_BE_MEETING', 'WILL_BE_FOLLOWED', 'REFUSED');

-- CreateTable
CREATE TABLE "CallSchedule" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ad" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "notes" TEXT,
    "contactDate" TIMESTAMP(3),
    "reasonForRejection" TEXT,
    "result" "CallResult" NOT NULL,

    CONSTRAINT "CallSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingSchedule" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ad" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "participant" TEXT,
    "contactNumber" TEXT,
    "position" TEXT,
    "meetingTime" TIMESTAMP(3),
    "notes" TEXT,
    "contactDate" TIMESTAMP(3),
    "reasonForRejection" TEXT,
    "result" "MeetingResult" NOT NULL,

    CONSTRAINT "MeetingSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CallSchedule" ADD CONSTRAINT "CallSchedule_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingSchedule" ADD CONSTRAINT "MeetingSchedule_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
