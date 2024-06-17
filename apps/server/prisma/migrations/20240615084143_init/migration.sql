/*
  Warnings:

  - You are about to drop the column `user_id` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `users_codes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `users_tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,code,type]` on the table `users_codes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `users_codes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `users_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_codes" DROP CONSTRAINT "users_codes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_tokens" DROP CONSTRAINT "users_tokens_user_id_fkey";

-- DropIndex
DROP INDEX "UserProfile_user_id_key";

-- DropIndex
DROP INDEX "users_codes_user_id_code_type_key";

-- DropIndex
DROP INDEX "users_tokens_user_id_key";

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users_codes" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users_tokens" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_codes_userId_code_type_key" ON "users_codes"("userId", "code", "type");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_tokens" ADD CONSTRAINT "users_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_codes" ADD CONSTRAINT "users_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
