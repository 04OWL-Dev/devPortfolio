const pool = require('../config/database');

const divisasController = {

    almacenarValor: async (valor) => {
        try {
            const insercion = await pool.query(`INSERT INTO divisas (valor, fecha_creacion) VALUES (${valor}, current_timestamp)`);
            return insercion
        } catch (error) {
            console.log('Error en el controlador de almacenarValor' + error)
        }
    }, 
    consultarValor: async () => {
        try {
            const consulta = await pool.query(`SELECT * FROM divisas WHERE fecha_creacion = CURRENT_DATE`);
            return consulta.rows[0]
        } catch (error) {
            console.log('Error en el controlador de consultarValor ' + error)
        }
    },

    consultaGeneral: async (req,res) => {
        try {
            const {rows} = await pool.query(`SELECT valor, TO_CHAR(fecha_creacion, 'DD/MM/YYYY') AS fecha_creacion FROM divisas ORDER BY fecha_creacion DESC`);
            res.json(rows)
        } catch (error) {
            console.log('Error en el controlador de consultaGeneral ' + error)
        }
    } 
}   

module.exports = divisasController