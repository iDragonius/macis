/*
  Warnings:

  - Added the required column `updated_ad` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CodeType" AS ENUM ('OTP');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_ad" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ad" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "fatherName" TEXT,
    "phoneNumber" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_tokens" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ad" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiration_date" TIMESTAMP(3),
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "users_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_codes" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "CodeType" NOT NULL,
    "code" TEXT NOT NULL,
    "expiration_date" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "users_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ad" TIMESTAMP(3) NOT NULL,
    "company" TEXT,
    "head" TEXT,
    "contactNumber" TEXT,
    "companyEstablishmentDate" TEXT,
    "curator" TEXT,
    "ownersBirthday" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveCustomer" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ad" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "contractDate" TEXT,
    "service" TEXT,
    "payment" TEXT,

    CONSTRAINT "ActiveCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LostCustomer" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ad" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "service" TEXT,
    "termsOfPayment" TEXT,
    "contractDate" TEXT,
    "contractExpirationDate" TEXT,
    "terminationReason" TEXT,

    CONSTRAINT "LostCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PotentialCustomer" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ad" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "position" TEXT,
    "source" TEXT,
    "notes" TEXT,
    "service" TEXT,

    CONSTRAINT "PotentialCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_user_id_key" ON "UserProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_tokens_refreshToken_key" ON "users_tokens"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_tokens_user_id_key" ON "users_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_codes_user_id_code_type_key" ON "users_codes"("user_id", "code", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveCustomer_customerId_key" ON "ActiveCustomer"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "LostCustomer_customerId_key" ON "LostCustomer"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "PotentialCustomer_customerId_key" ON "PotentialCustomer"("customerId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_tokens" ADD CONSTRAINT "users_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_codes" ADD CONSTRAINT "users_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveCustomer" ADD CONSTRAINT "ActiveCustomer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostCustomer" ADD CONSTRAINT "LostCustomer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PotentialCustomer" ADD CONSTRAINT "PotentialCustomer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
