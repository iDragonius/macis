/*
  Warnings:

  - The `ownersBirthday` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "ownersBirthday",
ADD COLUMN     "ownersBirthday" TIMESTAMP(3);
