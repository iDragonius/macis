/*
  Warnings:

  - You are about to drop the column `contractDate` on the `ActiveCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `ActiveCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `contractDate` on the `LostCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `contractExpirationDate` on the `LostCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `LostCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `PotentialCustomer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[company]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Made the column `company` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `head` on table `Customer` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'POTENTIAL', 'LOST');

-- AlterTable
ALTER TABLE "ActiveCustomer" DROP COLUMN "contractDate",
DROP COLUMN "service";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "contractDate" TIMESTAMP(3),
ADD COLUMN     "contractExpirationDate" TIMESTAMP(3),
ADD COLUMN     "service" TEXT,
ADD COLUMN     "status" "CustomerStatus" NOT NULL DEFAULT 'POTENTIAL',
ALTER COLUMN "company" SET NOT NULL,
ALTER COLUMN "head" SET NOT NULL;

-- AlterTable
ALTER TABLE "LostCustomer" DROP COLUMN "contractDate",
DROP COLUMN "contractExpirationDate",
DROP COLUMN "service";

-- AlterTable
ALTER TABLE "PotentialCustomer" DROP COLUMN "service";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_company_key" ON "Customer"("company");
