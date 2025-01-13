const pool = require('../config/database');

const clientesController = {

    obtenerClientes: async (req, res) => {
        try {
          const { rows } = await pool.query('SELECT * FROM clientes ORDER BY codigo asc');
          if (rows.length === 0) {
            res.status(404).json({ error: 'Cliente no encontrado' });
          } else {
            return rows
          }
          } catch (error) {
            res.render("error", { message: "Error al cargar los productos" });
          }
    },
    obtenerClientes2: async (req, res) => {
        try {
          const { rows } = await pool.query('SELECT * FROM clientes ORDER BY codigo asc');
          if (rows.length === 0) {
            res.status(404).json({ error: 'Clientes no encontrados' });
          } else {
            res.json(rows)
          }
          } catch (error) {
            res.render("error", { message: "Error al cargar los Clientes" });
          }
    },

    obtenerCliente: async (id) => {
      try {
        const { rows } = await pool.query(`SELECT * FROM clientes WHERE codigo = ${id}`);
        if (rows.length === 0) {  
          const error = 'Cliente no encontrado'    
          return error;
        } else {          
          return rows[0];
        }
      } catch (error) {
          return("error", { message: "Error al cargar la categoria" });
      }
  },
    
    //POR COMPLETAR
    obtenerClienteCedula: async (cedula) => {
      try {
        const cliente = await pool.query(`SELECT nombre,  telefono FROM clientes WHERE cedula LIKE `)        
      } catch (error) {
        console.log('Error en el controlador de obtenerClienteCedula')
      }
    },
    

    crearCliente: async (datosCliente) => {
      const { cedula, nombre, telefono, direccion } = datosCliente;
      try {
          await pool.query(
            `INSERT INTO clientes (cedula, nombre, telefono, direccion, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${cedula}', '${nombre}', '${telefono}', '${direccion}', current_timestamp, NULL, 1)`);        
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

    modificarCliente: async (datosCliente) => {    
      const { cedula, nombre, telefono, direccion, codigo } = datosCliente;
      try {
          // Obtener los datos actuales del cliente
          const { rows } = await pool.query(
              `SELECT cedula, nombre, telefono, direccion FROM clientes WHERE codigo = ${codigo}`
        );
  
          if (rows.length === 0) {
              return { success: false, message: "Cliente no encontrado." };
          }
      
        const clienteActual = rows[0];
        
        const cedulaNumero = Number(cedula);
        // Verificar si los datos han cambiado
        if (
            clienteActual.cedula === cedulaNumero &&
            clienteActual.nombre === nombre &&
            clienteActual.telefono === telefono &&
            clienteActual.direccion === direccion
        ) {
            return { success: false, message: "No se realizaron cambios." };
        }
  
          // Actualizar los datos si hay cambios
          await pool.query(
              `UPDATE clientes
               SET cedula = $1, nombre = $2, telefono = $3, direccion = $4, fecha_modificacion = current_timestamp
               WHERE codigo = $5`,
              [cedula, nombre, telefono, direccion, codigo]
          );   
  
          return { success: true, message: 'Cliente modificado exitosamente' };
      } catch (error) {
          if (error.code === '23505') { // Error de clave duplicada
              const match = /Key \(([^)]+)\)=\(([^)]+)\) already exists\./.exec(error.detail);
              if (match) {
                  return { success: false, message: `El valor '${match[2]}' para el campo '${match[1]}' ya existe.` };
              }
          }
          return { success: false, message: "Error al realizar los cambios. Intenta nuevamente." };
      }
  },

    eliminarCliente: async (codigo) => {    
      try {
          await pool.query(`DELETE FROM clientes WHERE codigo = ${codigo}`);       
      } catch (error) {
        return("error", { message: "Error al eliminar el cliente." });
      }    
    },

}

module.exports = clientesController;