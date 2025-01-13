import imagenes from "../models/imagenes.models.js";

const imagenesControllers = {
    guardarImagenes: async (url, nombre, radiografia_id) => {
        try {
            const imagen = await Promise.all(
                url.map((each, index) => imagenes.insercion(each, nombre[index], radiografia_id))
            );
            return imagen
        } catch (error) {
            console.log(`Error en el controlador 'guardarImagenes' ${error.message}`)
            throw error;
        }
    },

}
export default imagenesControllers