/*
  Warnings:

  - You are about to drop the column `paymentDescription` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `paymentPercent` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "paymentDescription",
DROP COLUMN "paymentPercent",
ADD COLUMN     "paymentInformation" TEXT;
