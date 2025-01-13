-- CreateTable
CREATE TABLE "Zonas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo_radiografia_id" INTEGER,

    CONSTRAINT "Zonas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Zonas_nombre_key" ON "Zonas"("nombre");

-- AddForeignKey
ALTER TABLE "Zonas" ADD CONSTRAINT "Zonas_tipo_radiografia_id_fkey" FOREIGN KEY ("tipo_radiografia_id") REFERENCES "TiposRadiografia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
