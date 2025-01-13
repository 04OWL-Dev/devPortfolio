/*
  Warnings:

  - You are about to drop the column `observacion` on the `Observaciones` table. All the data in the column will be lost.
  - Added the required column `contenido` to the `Observaciones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Observaciones" DROP COLUMN "observacion",
ADD COLUMN     "contenido" TEXT NOT NULL;
