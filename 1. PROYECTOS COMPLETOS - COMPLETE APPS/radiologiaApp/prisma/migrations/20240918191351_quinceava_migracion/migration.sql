-- DropIndex
DROP INDEX "Radiografias_estado_id_key";

-- DropIndex
DROP INDEX "Radiografias_paciente_id_key";

-- DropIndex
DROP INDEX "Radiografias_zona_radiografia_id_key";

-- AlterTable
ALTER TABLE "Radiografias" ALTER COLUMN "fecha" DROP NOT NULL;
