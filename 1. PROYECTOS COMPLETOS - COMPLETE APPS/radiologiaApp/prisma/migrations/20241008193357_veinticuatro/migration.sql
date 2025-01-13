/*
  Warnings:

  - Added the required column `nombre` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "nombre" TEXT NOT NULL;
