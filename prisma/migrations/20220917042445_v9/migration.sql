-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_coffeeId_fkey" FOREIGN KEY ("coffeeId") REFERENCES "Coffee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
