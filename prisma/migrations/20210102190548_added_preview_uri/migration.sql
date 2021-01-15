/*
  Warnings:

  - Added the required column `previewUri` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" TEXT NOT NULL,
    "baseName" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "previewUri" TEXT NOT NULL,
    "hasThumbnail" BOOLEAN NOT NULL,
    "hasSmall" BOOLEAN NOT NULL,
    "hasMedium" BOOLEAN NOT NULL,
    "hasLarge" BOOLEAN NOT NULL,
    PRIMARY KEY ("id")
);
INSERT INTO "new_Asset" ("id", "baseName", "metadata", "hasThumbnail", "hasSmall", "hasMedium", "hasLarge") SELECT "id", "baseName", "metadata", "hasThumbnail", "hasSmall", "hasMedium", "hasLarge" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
