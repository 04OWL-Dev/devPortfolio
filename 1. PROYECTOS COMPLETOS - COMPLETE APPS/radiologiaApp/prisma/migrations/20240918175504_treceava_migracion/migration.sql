/*
  Warnings:

  - The primary key for the `Observaciones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id,radiografia_id]` on the table `Observaciones` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Observaciones" DROP CONSTRAINT "Observaciones_radiografia_id_fkey";

-- DropForeignKey
ALTER TABLE "Radiografias" DROP CONSTRAINT "Radiografias_zona_radiografia_id_fkey";

-- AlterTable
ALTER TABLE "Observaciones" DROP CONSTRAINT "Observaciones_pkey",
ALTER COLUMN "radiografia_id" DROP NOT NULL,
ADD CONSTRAINT "Observaciones_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Radiografias" ALTER COLUMN "zona_radiografia_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Observaciones_id_radiografia_id_key" ON "Observaciones"("id", "radiografia_id");

-- AddForeignKey
ALTER TABLE "Radiografias" ADD CONSTRAINT "Radiografias_zona_radiografia_id_fkey" FOREIGN KEY ("zona_radiografia_id") REFERENCES "ZonasRadiografia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observaciones" ADD CONSTRAINT "Observaciones_radiografia_id_fkey" FOREIGN KEY ("radiografia_id") REFERENCES "Radiografias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
