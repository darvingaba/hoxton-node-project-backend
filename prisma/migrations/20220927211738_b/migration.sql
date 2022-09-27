/*
  Warnings:

  - Added the required column `image` to the `Nft` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Nft" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Nft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Nft" ("description", "id", "name", "price", "userId") SELECT "description", "id", "name", "price", "userId" FROM "Nft";
DROP TABLE "Nft";
ALTER TABLE "new_Nft" RENAME TO "Nft";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
