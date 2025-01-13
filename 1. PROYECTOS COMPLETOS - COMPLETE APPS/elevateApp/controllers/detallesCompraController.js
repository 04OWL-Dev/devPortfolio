const pool = require('../config/database');

const detallesCompraController = {

    actualizarCantidad: async (codigo_compra, codigo_producto, opcion, cantidad) => {

        await pool.query('SELECT * FROM detalles_compra WHERE codigo_ecompra = $1 AND codigo_producto = $2', [codigo_compra, codigo_producto])


    },

    eliminarDato: async() => {
        
    }

}

module.exports = detallesCompraController;