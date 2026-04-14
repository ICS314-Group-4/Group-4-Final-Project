-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Category" ADD VALUE 'google_core';
ALTER TYPE "Category" ADD VALUE 'star';
ALTER TYPE "Category" ADD VALUE 'duo_mobile';
ALTER TYPE "Category" ADD VALUE 'lamaku';
ALTER TYPE "Category" ADD VALUE 'network';
ALTER TYPE "Category" ADD VALUE 'general_support';
ALTER TYPE "Category" ADD VALUE 'site_licensed_apps';
ALTER TYPE "Category" ADD VALUE 'other';
