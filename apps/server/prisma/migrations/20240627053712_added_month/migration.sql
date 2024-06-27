/*
  Warnings:

  - Added the required column `month` to the `MonthlyTarget` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Month" AS ENUM ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septemper', 'October', 'November', 'December');

-- AlterTable
ALTER TABLE "MonthlyTarget" ADD COLUMN     "month" "Month" NOT NULL;
