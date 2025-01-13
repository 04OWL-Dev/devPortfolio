const pool = require('../config/database');
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');

const authController =  {

    auth: async (req) => {
        try {
            const valido = await pool.query(`SELECT * FROM usuarios WHERE username = '${req.body.user}' AND password ='${req.body.password}'`)
            if (valido.rowCount > 0) {
                req.session.user = {
                    id: valido.rows[0].codigo,
                    nombre: valido.rows[0].nombre_apellido,
                    username: `${req.body.user}`,
                    password: `${req.body.password}`,
                    roles: valido.rows[0].codigo_rol,
                  };
                return "0"
            } else {
                return "1"
            }
        } catch (err) {
            throw err; // Asegúrate de manejar este error en tu controlador de Express
            console.log("Se muestra el error: "+err)
        }

    },

    cambiarContraseña: async (codigo, contraseñaNueva) => {
        try {

            await pool.query(`UPDATE usuarios SET password= '${contraseñaNueva}', fecha_modificacion = current_timestamp, usuario_modificador = '${codigo}' WHERE codigo = ${codigo}`)
            
        } catch(err) {
            console.log('Ha ocurrido un error en el cambio de contraseña' + err)
        }
    }
}
module.exports = authController;

