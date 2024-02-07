/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Notes` table. All the data in the column will be lost.
  - You are about to drop the column `prioritiesId` on the `Notes` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `Notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority_id` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_prioritiesId_fkey";

-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "categoryId",
DROP COLUMN "prioritiesId",
ADD COLUMN     "category_id" TEXT NOT NULL,
ADD COLUMN     "priority_id" INTEGER NOT NULL,
ALTER COLUMN "is_favorite" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "Priorities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
