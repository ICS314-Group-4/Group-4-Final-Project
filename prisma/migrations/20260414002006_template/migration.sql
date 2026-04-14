-- CreateEnum
CREATE TYPE "Category" AS ENUM ('account');

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "template" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "author" TEXT NOT NULL,
    "used" INTEGER NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);
