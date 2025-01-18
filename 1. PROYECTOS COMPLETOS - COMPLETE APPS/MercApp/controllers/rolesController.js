const pool = require('../config/database');

const rolesController = {

    obtenerRoles: async () => {
        try {
            let roles = await pool.query(`SELECT codigo, nombre_rol FROM roles`);
            roles = roles.rows;
            return roles;
        } catch (e) {
            return ('error', 'Se ha producido un error' + e)
        }
    },
    obtenerRol: async (id) => {
        try {
            let rol = await pool.query(`SELECT codigo, nombre_rol FROM roles WHERE codigo = ${id}`);
            rol = rol.rows[0];          
            return rol;
        } catch (e) {
            return ('error', 'Se ha producido un error' + e)
        }
    }


}

module.exports = rolesController;


