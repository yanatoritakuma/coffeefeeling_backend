/*
  Warnings:

  - You are about to drop the column `amount` on the `Coffee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coffee" DROP COLUMN "amount",
ADD COLUMN     "comment" TEXT[];
