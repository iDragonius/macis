/*
  Warnings:

  - The `companyEstablishmentDate` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "companyEstablishmentDate",
ADD COLUMN     "companyEstablishmentDate" TIMESTAMP(3);
