-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Section" (
    "id" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
INSERT INTO "new_Section" ("id", "typeName", "data") SELECT "id", "typeName", "data" FROM "Section";
DROP TABLE "Section";
ALTER TABLE "new_Section" RENAME TO "Section";
CREATE UNIQUE INDEX "Section.timestamp_unique" ON "Section"("timestamp");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
