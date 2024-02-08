/*
  Warnings:

  - You are about to drop the column `role` on the `Auth` table. All the data in the column will be lost.
  - Added the required column `userRole` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "role",
ADD COLUMN     "userRole" "ROLES" NOT NULL;
