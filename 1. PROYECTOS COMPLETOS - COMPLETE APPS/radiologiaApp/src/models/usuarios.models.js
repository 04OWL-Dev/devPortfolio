import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const usuarios = {
    validarUsuario: async (user,password) => {
        try {
            const validacion = await prisma.usuarios.findFirst({
                where: {
                    username: user,
                    password: password
                }
            })

            if (!validacion) {
                return null
            } else {
                return validacion
            }            
        } catch (error) {
            console.log(`Error en el modelo validarUsuario ${error.message}`)
        }
    },
    obtenerUsuarios: async () => {
        try {
            const consulta = prisma.usuarios.findMany();
            return consulta;
        } catch (error) {
            console.log(`Error en el modelo obtenerUsuarios ${error.message}`)
        }
    }, 
    cambiarContrasena: async (id, contraseñaNueva) => {
        try {
            const contrasena = prisma.usuarios.update({
                where: {
                    id: id
                }, 
                data: {
                    password: contraseñaNueva
                }
            })
            return contrasena
        } catch (error) {
            console.log(`Error en el modelo obtenerUsuarios ${error.message}`)
        }
    },
    recuperarContrasena: async (email) => { 
        try {
            const password = await prisma.usuarios.update({
                where: {
                    email : email
                }, 
                data: {
                    password: Math.floor(Math.random() * 100000).toString()
                }
            })
            return password
        } catch (error) {
            const errorCompuesto = {
                code: error.code
            }            
            console.log(`Error en el modelo recuperarContrasena ${error.message}`)
            throw errorCompuesto;
        }
    }


}

export default usuarios;