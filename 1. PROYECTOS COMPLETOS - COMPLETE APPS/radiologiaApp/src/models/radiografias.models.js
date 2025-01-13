import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const radiografias = {
    listarRadiografias: async (usuario) => {
        try {
            let listado;
            if (usuario == 2) {//Condiciones para técnico
                listado = await prisma.radiografias.findMany({
                    where: {
                        OR: [
                            { estado_id: 1 },
                            { estado_id: 2 },
                            { estado_id: 3 },
                            { estado_id: 5 },
                            { estado_id: 7 },
                            { estado_id: 8 },
                        ]
                    },
                    select: {
                        id: true,
                        fecha: true,
                        estado_id: true,
                        paciente: {
                            select: {
                                nombres: true,
                                apellidos: true
                            }
                        }
                    }
                })
            } else if (usuario == 1) {//Condiciones para médico
                listado = await prisma.radiografias.findMany({
                    where: {
                        OR: [
                            { estado_id: 2 },
                            { estado_id: 3 },
                            { estado_id: 4 },
                            { estado_id: 5 },
                            { estado_id: 6 },
                            { estado_id: 8 },
                        ]
                    },
                    select: {
                        id: true,
                        fecha: true,
                        estado_id: true,
                        paciente: {
                            select: {
                                nombres: true,
                                apellidos: true
                            }
                        }
                    }
                })
            }
            listado.forEach(element => {
                const fechaOriginal = element.fecha;
                const fecha = new Date(fechaOriginal)
                const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                element.fecha = fechaFormateada;
                element.paciente = `${element.paciente.nombres} ${element.paciente.apellidos}`
            });
            return listado
        } catch (error) {
            console.log(`Error en la implementacion del modelo listarRadiografias ${error.message}`)
        }
    },
    obtenerRadiografía: async (id) => {
        try {
            const radiografia = await prisma.radiografias.findFirst({
                where: {
                    id: id
                },
                select: {
                    fecha: true,
                    tipo_radiografia: true,
                    zona_radiografia: true,
                    tecnica_radiografia: true,
                    observaciones: true,
                    estado_id: true,
                    paciente: {
                        select: {
                            id: true,
                            cedula: true,
                            nombres: true,
                            apellidos: true,
                            telefono: true,
                            direccion: true
                        }
                    },
                    informe: {
                        select: {
                            contenido: true, 
                            hallazgos: true
                        }
                    },
                    imagenes: {
                        select: {
                            url: true
                        }
                    }
                }
            })
            const fechaOriginal = radiografia.fecha;
            const fecha = new Date(fechaOriginal)
            const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            radiografia.fecha = fechaFormateada;
            return radiografia
        } catch (error) {
            console.log(`Error en la implementacion del modelo obtenerRadiografía ${error.message}`)
        }
    },
    actualizarRadiografia: async (params) => {
        await prisma.radiografias.update({
            where: {
                id: id
            },
            data: {
                tipo_radiografia_id: tipos,
                paciente: {
                    update: {
                        cedula: cedula,
                        nombres: nombres,
                        apellidos: apellidos,
                        telefono: telefono,
                        direccion: direccion
                    }
                },
                imagenes: {
                    update: {
                        
                    }
                }
            }
        })
    },
    guardarRadiografia: async (tipo_radiografia_id, paciente_id, tecnica_radiografia_id, estado_id, zona_radiografia_id, cedula, nombre, apellido, telefono, direccion, rutasImagenes, nombresImagenes) => {
        try {
            const insercion = await prisma.$transaction(async (prisma) => {
                let pacienteID
                if (!paciente_id) {
                    const paciente = await prisma.pacientes.create({
                        data: {
                            cedula: cedula,
                            nombres: nombre,
                            apellidos: apellido,
                            telefono: telefono,
                            direccion: direccion
                        }
                    })
                    pacienteID = paciente.id
                } else {
                    pacienteID = parseInt(paciente_id);
                }
                const nuevaRadiografia = await prisma.radiografias.create({
                    data: {
                        tipo_radiografia_id: tipo_radiografia_id,
                        paciente_id: pacienteID,
                        tecnica_radiografia_id: tecnica_radiografia_id,
                        estado_id: estado_id,
                        zona_radiografia_id: zona_radiografia_id
                    }
                })
                const imagenes = await Promise.all(
                    rutasImagenes.map(async (url, index) => {
                        try {
                            return await prisma.imagenes.create({
                                data: {
                                    url: url,
                                    radiografia_id: nuevaRadiografia.id
                                }
                            });
                        } catch (error) {
                            console.log(`Error al insertar imagen: ${nombresImagenes[index]}`);
                            const errorCompuesto = {
                                code: error.code,
                                nombre: nombresImagenes[index] // Nombre de la imagen que causó el error
                            };
                            throw errorCompuesto; // Lanza el error para ser manejado más arriba
                        }
                    })
                );
                return { pacienteID, nuevaRadiografia, imagenes };
            })
            return insercion;
        } catch (error) {
            console.log(`Error en la implementacion del modelo guardarRadiografía ${error.message}`)
            throw error;
        }
    },
    modificarRadiografia: async (radiografia_id, tipo_radiografia_id, paciente_id, tecnica_radiografia_id, estado_id, zona_radiografia_id, cedula, nombre, apellido, telefono, direccion, rutasImagenes, nombresImagenes) => {
        try {
            const insercion = await prisma.$transaction(async (prisma) => {
                const paciente = await prisma.pacientes.update({
                    where: { id: paciente_id },
                    data: {
                        cedula: cedula,
                        nombres: nombre,
                        apellidos: apellido,
                        telefono: telefono,
                        direccion: direccion
                    }
                });
    
                // Actualiza la radiografía
                const nuevaRadiografia = await prisma.radiografias.update({
                    where: { id: radiografia_id },
                    data: {
                        tipo_radiografia_id: tipo_radiografia_id,
                        tecnica_radiografia_id: tecnica_radiografia_id,
                        estado_id: estado_id,
                        zona_radiografia_id: zona_radiografia_id
                    }
                });
    
                // Obtiene las imágenes existentes
                // Obtiene las imágenes existentes
                const imagenesExistentes = await prisma.imagenes.findMany({
                    where: { radiografia_id: radiografia_id }
                });

                // Elimina imágenes que ya no están en los nuevos datos
                const imagenesParaEliminar = imagenesExistentes.filter(imagen => !rutasImagenes.includes(imagen.url));
                await Promise.all(imagenesParaEliminar.map(imagen =>
                    prisma.imagenes.delete({
                        where: {
                            id_radiografia_id: { // Utiliza el campo combinado
                                id: imagen.id,
                                radiografia_id: radiografia_id
                            }
                        }
                    })
                ));
    
                // Inserta nuevas imágenes, evitando duplicados
                const imagenesNuevas = await Promise.all(
                    rutasImagenes.map(async (url, index) => {
                        const existeImagen = imagenesExistentes.some(imagen => imagen.url === url);
                        // Solo inserta si la imagen no existe ya
                        if (!existeImagen) {
                            try {
                                return await prisma.imagenes.create({
                                    data: {
                                        url: url,
                                        radiografia_id: nuevaRadiografia.id
                                    }
                                });
                            } catch (error) {
                                console.log(`Error al insertar imagen: ${nombresImagenes[index]}`);
                                const errorCompuesto = {
                                    code: error.code,
                                    nombre: nombresImagenes[index] // Nombre de la imagen que causó el error
                                };
                                throw errorCompuesto; // Lanza el error para ser manejado más arriba
                            }
                        }
                    })
                );
                return { paciente_id, nuevaRadiografia, imagenesNuevas };
            });
            return insercion;
        } catch (error) {
            console.log(`Error en la implementación del modelo modificarRadiografía: ${error.message}`);
            throw error;
        }
    },
    introducirInforme: async (id, estado, informe, hallazgos, observaciones) => {
        try {

            if (estado != 7) {
                // Verificar si la radiografía existe
                const existingRadiografia = await prisma.radiografias.findUnique({
                    where: { id: id },
                    include: { informe: true } // Incluir el informe para verificar su existencia
                });
        
                if (!existingRadiografia) {
                    throw new Error('Radiografía no encontrada.');
                }

                // Si el informe existe, actualízalo; si no, créalo
                const insercion = await prisma.radiografias.update({
                    where: { id: id },
                    data: {
                        estado: {
                            connect: { id: estado }
                        },
                        informe: existingRadiografia.informe
                            ? {
                                update: {
                                    contenido: informe,
                                    hallazgos: hallazgos
                                }
                            }
                            : {
                                create: {
                                    contenido: informe,
                                    hallazgos: hallazgos
                                }
                            },
                        // Actualizar el campo de observaciones si es necesario
                        observaciones: observaciones
                    }
                });
                return insercion;
            }else{
                const observacion = await prisma.radiografias.update({
                    where: {
                        id: id
                    },
                    data: {
                        estado: {
                            connect: { id: estado }
                        },
                        observaciones: observaciones
                    }
                })
                return observacion
            }
        } catch (error) {
            console.log(`Error en la implementación del modelo introducirInforme: ${error.message}`);
            throw error;
        }
    },
    actualizarEstado: async (id, estado) => {
        try {
            const actualizacion = await prisma.radiografias.update({
                where: {
                    id: id
                },
                data: {
                    estado: {
                        connect: { id: estado }
                    }
                }
            })
            return actualizacion
        } catch (error) {
            console.log(`Error en la implementación del modelo actualizarEstado: ${error.message}`);
            throw error;
        }
    },
    introducirObservacion: async (id, estado, observacion) => {
        try {
            const actualizacion = await prisma.radiografias.update({
                where: {
                    id: id
                },
                data: {
                    estado: {
                        connect: { id: estado }
                    },
                    observaciones: observacion
                }
            })
            return actualizacion
        } catch (error) {
            console.log(`Error en la implementación del modelo introducirObservacion: ${error.message}`);
            throw error;
        }
    },
}
export default radiografias