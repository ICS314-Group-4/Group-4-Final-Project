/*
  Warnings:

  - The values [account,google_core,star,duo_mobile,lamaku,network,general_support,site_licensed_apps] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Stuff` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('Google Core/Consumer Apps', 'STAR/Banner', 'UH Account', 'Duo Mobile/MFA', 'Lamaku/Laulima LMS', 'Network/Printing', 'General Support', 'Site License');
ALTER TABLE "Template" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;

-- DropTable
DROP TABLE "Stuff";

-- DropEnum
DROP TYPE "Condition";
