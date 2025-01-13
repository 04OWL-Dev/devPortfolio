/*
  Warnings:

  - You are about to drop the column `medico` on the `Radiografias` table. All the data in the column will be lost.
  - You are about to drop the column `pacienteId` on the `Radiografias` table. All the data in the column will be lost.
  - You are about to drop the column `tecnico` on the `Radiografias` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[estado_id]` on the table `Radiografias` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zona_radiografia_id]` on the table `Radiografias` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `estado_id` to the `Radiografias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zona_radiografia_id` to the `Radiografias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Radiografias" DROP COLUMN "medico",
DROP COLUMN "pacienteId",
DROP COLUMN "tecnico",
ADD COLUMN     "estado_id" INTEGER NOT NULL,
ADD COLUMN     "zona_radiografia_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Estados" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Estados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Radiografias_estado_id_key" ON "Radiografias"("estado_id");

-- CreateIndex
CREATE UNIQUE INDEX "Radiografias_zona_radiografia_id_key" ON "Radiografias"("zona_radiografia_id");

-- AddForeignKey
ALTER TABLE "Radiografias" ADD CONSTRAINT "Radiografias_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "Estados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Radiografias" ADD CONSTRAINT "Radiografias_zona_radiografia_id_fkey" FOREIGN KEY ("zona_radiografia_id") REFERENCES "ZonasRadiografia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
