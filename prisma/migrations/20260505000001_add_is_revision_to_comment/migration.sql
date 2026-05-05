-- AlterTable
ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "isRevision" BOOLEAN NOT NULL DEFAULT false;

-- Backfill existing revision comments written by editTemplate
UPDATE "Comment" SET "isRevision" = true
WHERE "body" LIKE 'Revised:%'
   OR "body" = 'The template was revised (no metadata changes).';
