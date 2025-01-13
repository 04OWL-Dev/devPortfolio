/*
  Warnings:

  - A unique constraint covering the columns `[tecnica_radiografia_id]` on the table `Radiografias` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tecnica_radiografia_id` to the `Radiografias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Radiografias" ADD COLUMN     "tecnica_radiografia_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TecnicasRadiografia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TecnicasRadiografia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TecnicasRadiografia_nombre_key" ON "TecnicasRadiografia"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Radiografias_tecnica_radiografia_id_key" ON "Radiografias"("tecnica_radiografia_id");

-- AddForeignKey
ALTER TABLE "Radiografias" ADD CONSTRAINT "Radiografias_tecnica_radiografia_id_fkey" FOREIGN KEY ("tecnica_radiografia_id") REFERENCES "TecnicasRadiografia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
