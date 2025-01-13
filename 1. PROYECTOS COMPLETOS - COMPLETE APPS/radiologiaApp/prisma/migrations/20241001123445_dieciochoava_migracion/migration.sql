/*
  Warnings:

  - Added the required column `hallazgos` to the `Informes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Informes" ADD COLUMN     "hallazgos" TEXT NOT NULL;
