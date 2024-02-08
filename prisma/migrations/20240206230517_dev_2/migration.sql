/*
  Warnings:

  - You are about to drop the column `priority` on the `Notes` table. All the data in the column will be lost.
  - Added the required column `isFavorite` to the `Notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prioritiesId` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "priority",
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL,
ADD COLUMN     "prioritiesId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Priorities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priorityNumber" INTEGER NOT NULL,

    CONSTRAINT "Priorities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Priorities_name_key" ON "Priorities"("name");

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_prioritiesId_fkey" FOREIGN KEY ("prioritiesId") REFERENCES "Priorities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
