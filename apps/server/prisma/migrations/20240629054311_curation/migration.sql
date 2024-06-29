/*
  Warnings:

  - You are about to drop the column `curatorId` on the `Customer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_curatorId_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "curatorId",
ADD COLUMN     "curator" TEXT,
ADD COLUMN     "managerId" TEXT;

-- CreateTable
CREATE TABLE "CurationCall" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ad" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "callDate" TIMESTAMP(3),
    "customerFeedback" TEXT,
    "customerRequests" TEXT,
    "notes" TEXT,
    "meetingDate" TIMESTAMP(3),

    CONSTRAINT "CurationCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurationMeeting" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ad" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "meetingDate" TIMESTAMP(3),
    "meetingTime" TEXT,
    "customerFeedback" TEXT,
    "customerRequests" TEXT,
    "nuances" TEXT,
    "referenceCompanies" TEXT,
    "notes" TEXT,

    CONSTRAINT "CurationMeeting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurationCall" ADD CONSTRAINT "CurationCall_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurationMeeting" ADD CONSTRAINT "CurationMeeting_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
