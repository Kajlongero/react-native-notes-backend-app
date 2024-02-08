/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `Notes` table. All the data in the column will be lost.
  - You are about to drop the column `priorityNumber` on the `Priorities` table. All the data in the column will be lost.
  - Added the required column `is_favorite` to the `Notes` table without a default value. This is not possible if the table is not empty.
  - Made the column `categoryId` on table `Notes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `priority_number` to the `Priorities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_categoryId_fkey";

-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "isFavorite",
ADD COLUMN     "is_favorite" BOOLEAN NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Priorities" DROP COLUMN "priorityNumber",
ADD COLUMN     "priority_number" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
