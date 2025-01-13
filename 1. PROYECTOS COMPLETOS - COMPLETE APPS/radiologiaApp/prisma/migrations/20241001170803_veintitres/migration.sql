/*
  Warnings:

  - You are about to drop the `Observaciones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Observaciones" DROP CONSTRAINT "Observaciones_radiografia_id_fkey";

-- AlterTable
ALTER TABLE "Informes" ADD COLUMN     "observaciones" TEXT;

-- AlterTable
ALTER TABLE "Radiografias" ADD COLUMN     "observaciones" TEXT;

-- DropTable
DROP TABLE "Observaciones";
