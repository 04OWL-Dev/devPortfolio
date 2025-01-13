/*
  Warnings:

  - Made the column `radiografia_id` on table `Observaciones` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Observaciones" DROP CONSTRAINT "Observaciones_radiografia_id_fkey";

-- AlterTable
ALTER TABLE "Observaciones" ALTER COLUMN "radiografia_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Observaciones" ADD CONSTRAINT "Observaciones_radiografia_id_fkey" FOREIGN KEY ("radiografia_id") REFERENCES "Radiografias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
