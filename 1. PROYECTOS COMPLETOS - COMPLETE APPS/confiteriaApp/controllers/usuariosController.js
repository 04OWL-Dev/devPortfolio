const pool = require('../config/database');
const rolesController = require('./rolesController');

const usuariosController = {

    obtenerUsuarios: async (req, res) => {
        try {
          const { rows } = await pool.query('SELECT * FROM usuarios ORDER BY codigo asc');
          if (rows.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
          } else {
            return rows
          }
          } catch (error) {
            res.render("error", { message: "Error al cargar los Usuarios" });
          }
    },
    obtenerUsuarios2: async (req, res) => {
        try {
          const { rows } = await pool.query('SELECT usuarios.*, roles.nombre_rol FROM usuarios JOIN roles ON usuarios.codigo_rol = roles.codigo;');
          if (rows.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
          } else {
            res.json(rows)
          }
          } catch (error) {
            res.render("error", { message: "Error al cargar los Clientes" });
          }
    },

    obtenerUsuario: async (id) => {
      try {
            let usuario = await pool.query(`SELECT * FROM usuarios WHERE codigo = ${id}`);
            usuario = {
                username: usuario.rows[0].username, 
                password: usuario.rows[0].password,
                rol: usuario.rows[0].codigo_rol
            }

            let rol = await rolesController.obtenerRol(usuario.rol);
            rol = {
                codigo : rol.codigo,
                nombre_rol : rol.nombre_rol
            }

            return [usuario,rol]
      } catch (error) {
          return("error", { message: "Error al cargar la categoria" + error });
      }
    },

    crearUsuario: async (datosUsuario) => {
      const { username, password, rol,} = datosUsuario;
      try {
          await pool.query(
            `INSERT INTO usuarios(username, password, codigo_rol, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${username}', '${password}', '${rol}', current_timestamp, NULL, NULL);`
        ); 
        return { success: true};
      } catch (error) {
          const regex = /Key \(([^)]+)\)=\(([^)]+)\) already exists\./;
          const match = regex.exec(error.detail);
          if (match) {
              const key = match[1];
              const value = match[2];
              return { message: `El valor '${value}' para el campo '${key}' ya existe.` };
          }
          return { message: "Error de clave duplicada." };
      }    
    },

    modificarUsuario : async (datosUsuario) => {
      const { password, rol, id, usuario } = datosUsuario;
      try {
          // Obtener los datos actuales del usuario
          const { rows } = await pool.query(
              `SELECT password, codigo_rol FROM usuarios WHERE codigo = $1`,
              [id]
          );
  
          if (rows.length === 0) {
              return { success: false, message: "Usuario no encontrado." };
          }
  
          const usuarioActual = rows[0];
  
          // Verificar si los datos han cambiado
          if (
              usuarioActual.password === password &&
              usuarioActual.codigo_rol.toString() === rol
          ) {
              return { success: false, message: "No se realizaron cambios." };
          }
  
          // Actualizar los datos si hay cambios
          await pool.query(
              `UPDATE usuarios
               SET password = '${password}', codigo_rol = ${rol}, fecha_modificacion = current_timestamp, usuario_modificador = NULL
               WHERE codigo = ${id}`
          );
  
          return { success: true, message: 'Usuario modificado exitosamente' };
      } catch (error) {
          if (error.code === '23505') { // Error de clave duplicada
              const match = /Key \(([^)]+)\)=\(([^)]+)\) already exists\./.exec(error.detail);
              if (match) {
                  return { success: false, message: `El valor '${match[2]}' para el campo '${match[1]}' ya existe.` };
              }
          }
          return { success: false, message: "Error al realizar los cambios. Intenta nuevamente." + error };
      }
  },

    eliminarUsuario: async (codigo) => {    
      try {
          await pool.query(`DELETE FROM usuarios WHERE codigo = ${codigo}`);       
      } catch (error) {
        return("error", { message: "Error al eliminar el Usuario." });
      }    
    },

}

module.exports = usuariosController;