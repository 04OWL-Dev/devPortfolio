import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const tecnicas = {
    obtenerTecnicas: async () => {
        try {
            const consulta = prisma.tecnicasRadiografia.findMany();
            return consulta;
        } catch (error) {
            console.log(`Error en el modelo obtenerTecnicas ${error.message}`)
        }
    }
}

export default tecnicas;