/*
  Warnings:

  - You are about to drop the `ZonasRadiografia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ZonasRadiografia" DROP CONSTRAINT "ZonasRadiografia_tipo_radiografia_id_fkey";

-- DropTable
DROP TABLE "ZonasRadiografia";
