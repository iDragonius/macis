/*
  Warnings:

  - Added the required column `year` to the `MonthlyTarget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MonthlyTarget" ADD COLUMN     "year" INTEGER NOT NULL;
