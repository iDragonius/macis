/*
  Warnings:

  - You are about to drop the column `payment` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "payment",
ADD COLUMN     "paymentAmount" INTEGER;
