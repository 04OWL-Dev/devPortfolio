import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

const tipos = {    
    tiposZonas: async () => {
        try {
            const consulta = await prisma.tiposRadiografia.findMany({
                select: {
                    id: true,
                    nombre: true,
                    zonas: {//Objeto zona dentro del objeto tipo.
                        select: {
                            id:true,
                            nombre: true, 
                            tipo_radiografia_id: true
                        }
                    }
                }
            })
            return consulta; 
        } catch (error) {
            console.log(`Error en el modelo tiposZonas ${error.message}`)
        }
    }    
}

export default tipos