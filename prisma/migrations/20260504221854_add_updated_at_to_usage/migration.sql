/*
  Warnings:

  - Added the required column `updatedAt` to the `TemplateUsage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TemplateUsage" DROP CONSTRAINT "TemplateUsage_templateId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateUsage" DROP CONSTRAINT "TemplateUsage_userId_fkey";

-- AlterTable
ALTER TABLE "TemplateUsage" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "TemplateUsage" ADD CONSTRAINT "TemplateUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateUsage" ADD CONSTRAINT "TemplateUsage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
