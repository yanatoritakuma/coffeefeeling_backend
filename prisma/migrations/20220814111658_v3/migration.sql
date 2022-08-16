/*
  Warnings:

  - You are about to drop the column `comment` on the `Coffee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coffee" DROP COLUMN "comment",
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "bitter" DROP NOT NULL,
ALTER COLUMN "acidity" DROP NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "place" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "likes" INTEGER[];

-- AddForeignKey
ALTER TABLE "Coffee" ADD CONSTRAINT "Coffee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
