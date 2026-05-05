-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "masterCode" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

-- Seed default row
INSERT INTO "SiteConfig" ("id", "masterCode") VALUES (1, '') ON CONFLICT DO NOTHING;

-- CreateTable
CREATE TABLE "WhitelistEntry" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "WhitelistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistEntry_username_key" ON "WhitelistEntry"("username");
