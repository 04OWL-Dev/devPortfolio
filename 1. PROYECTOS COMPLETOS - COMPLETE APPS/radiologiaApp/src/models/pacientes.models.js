import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const pacientes = {

    listarPacientes: async () => {
        try {
            const listado = await prisma.pacientes.findMany({
                select: {
                    id: true,
                    nombres: true,
                    apellidos: true, 
                    telefono: true, 
                    direccion: true, 
                    cedula: true
                }
            })
            listado.forEach(element => {
                element.nombre = `${element.nombres} ${element.apellidos}`
                delete element.nombres
                delete element.apellidos
            });
            return listado
        } catch (error) {
            console.log(`Error en la implementacion del modelo listarPacientes ${error.message}`)
        }
    },
    obtenerPaciente: async (id) => {
        try {
            const paciente = await prisma.pacientes.findFirst({
                where: {id: id}
            })
            return paciente
        } catch (error) {
            console.log(`Error en la implementacion del modelo obtenerPaciente ${error.message}`)
        }
    },
    actualizarPaciente: async (id, nombres,apellidos, cedula, telefono, direccion) => {
        try {
            const actualizacion = await prisma.pacientes.update({
                where: { id: id }, 
                data: {
                    nombres: nombres, 
                    cedula: cedula,
                    apellidos: apellidos, 
                    telefono: telefono, 
                    direccion: direccion
                }
            }) 
        } catch (error) {
            console.log(`Error en la implementacion del modelo actualizarPaciente ${error.message}`)
        }
    },
    autocompletePacientes: async (cedula) => {
        try {
            const autocomplete = await prisma.pacientes.findMany({
                where: {
                    cedula: {
                        startsWith: cedula
                    }
                }, 
                take: 10
            });
            return autocomplete;
        } catch (error) {
            console.log(`Error en la implementacion del modelo autocompletePacientes ${error.message}`)
        }
    },
    registrarPaciente : async (cedula, nombre, apellido, telefono, direccion) => {
        try {
            const insercion = await prisma.pacientes.create({
                data: {
                    cedula: cedula, 
                    nombres: nombre,
                    apellidos: apellido, 
                    telefono: telefono, 
                    direccion: direccion
                }
            })
            return insercion.id;
        } catch (error) {
            console.log(`Error en la implementacion del modelo registrarPaciente ${error.message}`)
        }
    }
}
export default pacientes;