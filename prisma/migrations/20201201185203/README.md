# Migration `20201201185203`

This migration has been generated by Cal Irvine at 12/1/2020, 1:52:03 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    PRIMARY KEY ("id")
)

CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    PRIMARY KEY ("id")
)

CREATE TABLE "SectionToPage" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
)

CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    PRIMARY KEY ("id")
)

CREATE TABLE "BlocksToSections" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,

    FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "Page.slug_unique" ON "Page"("slug")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201201185203
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,48 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "sqlite"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Page {
+  id        String @id @default(cuid())
+  slug      String @unique
+  sections  SectionToPage[]
+}
+
+model Section {
+  id        String @id @default(cuid())
+  typeName  String
+  data      String 
+  pages     SectionToPage[]
+  blocks    BlocksToSections[]
+}
+
+model SectionToPage {
+  id        String @id @default(cuid())
+  page      Page @relation(fields: [pageId])
+  pageId    String
+  section   Section @relation(fields: [sectionId])
+  sectionId String 
+}
+
+model Block {
+  id        String @id @default(cuid())
+  typeName  String
+  data      String
+  sections  BlocksToSections[]
+}
+
+model BlocksToSections {
+  id        String @id @default(cuid())
+  block     Block @relation(fields: [blockId])
+  blockId   String
+  section   Section @relation(fields: [sectionId])
+  sectionId String
+}
```

