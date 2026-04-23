-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "used" SET DEFAULT 0;

-- CreateTable (safe: skips if already exists from previous migration)
CREATE TABLE IF NOT EXISTS "TemplateUsage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,

    CONSTRAINT "TemplateUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (safe: skips if already exists)
CREATE UNIQUE INDEX IF NOT EXISTS "TemplateUsage_userId_templateId_key" ON "TemplateUsage"("userId", "templateId");

-- AddForeignKey (safe: skips if already exists)
DO $$ BEGIN
  ALTER TABLE "TemplateUsage" ADD CONSTRAINT "TemplateUsage_templateId_fkey"
    FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "TemplateUsage" ADD CONSTRAINT "TemplateUsage_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
