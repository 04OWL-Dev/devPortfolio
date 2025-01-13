/*
  Warnings:

  - You are about to drop the `Zonas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Zonas" DROP CONSTRAINT "Zonas_tipo_radiografia_id_fkey";

-- DropTable
DROP TABLE "Zonas";

-- CreateTable
CREATE TABLE "ZonasRadiografia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo_radiografia_id" INTEGER,

    CONSTRAINT "ZonasRadiografia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZonasRadiografia_nombre_key" ON "ZonasRadiografia"("nombre");

-- AddForeignKey
ALTER TABLE "ZonasRadiografia" ADD CONSTRAINT "ZonasRadiografia_tipo_radiografia_id_fkey" FOREIGN KEY ("tipo_radiografia_id") REFERENCES "TiposRadiografia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
