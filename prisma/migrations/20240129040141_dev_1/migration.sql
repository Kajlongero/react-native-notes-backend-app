/*
  Warnings:

  - You are about to drop the column `usersId` on the `Categories` table. All the data in the column will be lost.
  - Added the required column `role` to the `Auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Categories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ROLES" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_usersId_fkey";

-- AlterTable
ALTER TABLE "Auth" ADD COLUMN     "role" "ROLES" NOT NULL;

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "usersId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
