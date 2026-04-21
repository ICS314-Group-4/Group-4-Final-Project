-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "used" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "TemplateUsage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,

    CONSTRAINT "TemplateUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemplateUsage_userId_templateId_key" ON "TemplateUsage"("userId", "templateId");

-- AddForeignKey
ALTER TABLE "TemplateUsage" ADD CONSTRAINT "TemplateUsage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateUsage" ADD CONSTRAINT "TemplateUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
