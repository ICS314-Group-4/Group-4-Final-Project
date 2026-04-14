/*
  Warnings:

  - The values [other] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `title` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('account', 'google_core', 'star', 'duo_mobile', 'lamaku', 'network', 'general_support', 'site_licensed_apps');
ALTER TABLE "Template" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL;
