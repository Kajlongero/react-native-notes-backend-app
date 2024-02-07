/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Notes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Notes` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "deletedAt",
DROP COLUMN "name",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
