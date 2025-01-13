/*
  Warnings:

  - You are about to drop the column `estatus` on the `Radiografias` table. All the data in the column will be lost.
  - You are about to drop the column `imagen_url` on the `Radiografias` table. All the data in the column will be lost.
  - You are about to drop the column `observacion` on the `Radiografias` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Radiografias" DROP COLUMN "estatus",
DROP COLUMN "imagen_url",
DROP COLUMN "observacion";

-- CreateTable
CREATE TABLE "Imagenes" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "radiografia_id" INTEGER NOT NULL,

    CONSTRAINT "Imagenes_pkey" PRIMARY KEY ("id","radiografia_id")
);

-- CreateTable
CREATE TABLE "Observaciones" (
    "id" SERIAL NOT NULL,
    "observacion" TEXT NOT NULL,
    "radiografia_id" INTEGER NOT NULL,

    CONSTRAINT "Observaciones_pkey" PRIMARY KEY ("id","radiografia_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Imagenes_url_key" ON "Imagenes"("url");

-- AddForeignKey
ALTER TABLE "Imagenes" ADD CONSTRAINT "Imagenes_radiografia_id_fkey" FOREIGN KEY ("radiografia_id") REFERENCES "Radiografias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observaciones" ADD CONSTRAINT "Observaciones_radiografia_id_fkey" FOREIGN KEY ("radiografia_id") REFERENCES "Radiografias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
