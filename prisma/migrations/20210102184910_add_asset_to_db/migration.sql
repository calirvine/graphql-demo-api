-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "baseName" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "hasThumbnail" BOOLEAN NOT NULL,
    "hasSmall" BOOLEAN NOT NULL,
    "hasMedium" BOOLEAN NOT NULL,
    "hasLarge" BOOLEAN NOT NULL,
    PRIMARY KEY ("id")
);
