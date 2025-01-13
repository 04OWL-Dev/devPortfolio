/*
  Warnings:

  - You are about to drop the column `tipo_radiografia` on the `TiposRadiografia` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `TiposRadiografia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nombre` to the `TiposRadiografia` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TiposRadiografia_tipo_radiografia_key";

-- AlterTable
ALTER TABLE "TiposRadiografia" DROP COLUMN "tipo_radiografia",
ADD COLUMN     "nombre" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TiposRadiografia_nombre_key" ON "TiposRadiografia"("nombre");
