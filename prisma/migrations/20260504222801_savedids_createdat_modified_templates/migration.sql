-- DropForeignKey
ALTER TABLE "TemplateUsage" DROP CONSTRAINT "TemplateUsage_templateId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateUsage" DROP CONSTRAINT "TemplateUsage_userId_fkey";

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "savedIds" INTEGER[];

-- AddForeignKey
ALTER TABLE "TemplateUsage" ADD CONSTRAINT "TemplateUsage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateUsage" ADD CONSTRAINT "TemplateUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
