/*
  Warnings:

  - You are about to drop the `ActiveCustomer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LostCustomer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PotentialCustomer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActiveCustomer" DROP CONSTRAINT "ActiveCustomer_customerId_fkey";

-- DropForeignKey
ALTER TABLE "LostCustomer" DROP CONSTRAINT "LostCustomer_customerId_fkey";

-- DropForeignKey
ALTER TABLE "PotentialCustomer" DROP CONSTRAINT "PotentialCustomer_customerId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "payment" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "terminationReason" TEXT,
ADD COLUMN     "termsOfPayment" TEXT;

-- DropTable
DROP TABLE "ActiveCustomer";

-- DropTable
DROP TABLE "LostCustomer";

-- DropTable
DROP TABLE "PotentialCustomer";
