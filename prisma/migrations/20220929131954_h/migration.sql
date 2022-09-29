/*
  Warnings:

  - Made the column `userId` on table `Nft` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Nft" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Nft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Nft" ("description", "id", "image", "name", "price", "userId") SELECT "description", "id", "image", "name", "price", "userId" FROM "Nft";
DROP TABLE "Nft";
ALTER TABLE "new_Nft" RENAME TO "Nft";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
