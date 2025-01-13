-- CreateTable
CREATE TABLE "Radiografias" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imagen_url" TEXT NOT NULL,
    "tecnico" TEXT NOT NULL,
    "medico" TEXT NOT NULL,
    "estatus" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "tipo_radiografia_id" INTEGER NOT NULL,
    "paciente_id" INTEGER NOT NULL,

    CONSTRAINT "Radiografias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiposRadiografia" (
    "id" SERIAL NOT NULL,
    "tipo_radiografia" TEXT NOT NULL,

    CONSTRAINT "TiposRadiografia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pacientes" (
    "id" SERIAL NOT NULL,
    "cedula" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,

    CONSTRAINT "Pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tipo_usuario_id" INTEGER NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiposUsuario" (
    "id" SERIAL NOT NULL,
    "tipo_usuario" TEXT NOT NULL,

    CONSTRAINT "TiposUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Radiografias_codigo_key" ON "Radiografias"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Radiografias_paciente_id_key" ON "Radiografias"("paciente_id");

-- CreateIndex
CREATE UNIQUE INDEX "TiposRadiografia_tipo_radiografia_key" ON "TiposRadiografia"("tipo_radiografia");

-- CreateIndex
CREATE UNIQUE INDEX "Pacientes_cedula_key" ON "Pacientes"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_username_key" ON "Usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_tipo_usuario_id_key" ON "Usuarios"("tipo_usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "TiposUsuario_tipo_usuario_key" ON "TiposUsuario"("tipo_usuario");

-- AddForeignKey
ALTER TABLE "Radiografias" ADD CONSTRAINT "Radiografias_tipo_radiografia_id_fkey" FOREIGN KEY ("tipo_radiografia_id") REFERENCES "TiposRadiografia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Radiografias" ADD CONSTRAINT "Radiografias_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "Pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_tipo_usuario_id_fkey" FOREIGN KEY ("tipo_usuario_id") REFERENCES "TiposUsuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
