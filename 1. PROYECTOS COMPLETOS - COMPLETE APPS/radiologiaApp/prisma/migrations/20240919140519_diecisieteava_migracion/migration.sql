/*
  Warnings:

  - A unique constraint covering the columns `[informe_id]` on the table `Radiografias` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Radiografias" ADD COLUMN     "informe_id" INTEGER;

-- CreateTable
CREATE TABLE "Informes" (
    "id" SERIAL NOT NULL,
    "contenido" TEXT NOT NULL,

    CONSTRAINT "Informes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Radiografias_informe_id_key" ON "Radiografias"("informe_id");

-- AddForeignKey
ALTER TABLE "Radiografias" ADD CONSTRAINT "Radiografias_informe_id_fkey" FOREIGN KEY ("informe_id") REFERENCES "Informes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
