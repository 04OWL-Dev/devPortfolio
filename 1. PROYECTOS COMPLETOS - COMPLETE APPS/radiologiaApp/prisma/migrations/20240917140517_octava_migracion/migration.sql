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
