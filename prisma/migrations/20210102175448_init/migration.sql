-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionToPage" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlocksToSections" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page.slug_unique" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Block.timestamp_unique" ON "Block"("timestamp");
