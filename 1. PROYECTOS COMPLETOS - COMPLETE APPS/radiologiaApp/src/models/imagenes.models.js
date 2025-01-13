import pkg from '@prisma/client';
const { PrismaClient, PrismaClientKnownRequestError } = pkg;

const prisma = new PrismaClient()
const imagenes = {
    insercion: async (url, nombre, radiografia_id) => {
        try {
            const insercion = await prisma.imagenes.create({
                data: {
                    url: url,
                    radiografia_id: radiografia_id
                }
            })
            return insercion
        } catch (error) {
            console.log(error)
            console.log(`Error en el modelo 'insercion' de imagenes ${error.message}`)
            const errorCompuesto = {
                code: error.code,
                nombre : nombre
            }
            throw errorCompuesto;
        }        
    }
}
export default imagenes