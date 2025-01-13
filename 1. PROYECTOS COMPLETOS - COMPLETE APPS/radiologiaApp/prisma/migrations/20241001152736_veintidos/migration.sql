-- DropForeignKey
ALTER TABLE "Observaciones" DROP CONSTRAINT "Observaciones_radiografia_id_fkey";

-- AlterTable
ALTER TABLE "Observaciones" ALTER COLUMN "radiografia_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Observaciones" ADD CONSTRAINT "Observaciones_radiografia_id_fkey" FOREIGN KEY ("radiografia_id") REFERENCES "Radiografias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
