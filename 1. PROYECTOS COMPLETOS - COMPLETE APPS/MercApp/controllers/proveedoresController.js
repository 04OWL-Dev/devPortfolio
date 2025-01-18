const pool = require('../config/database');
const proveedoresController = {


    obtenerProveedores: async (req, res) => {
        try {
          const { rows } = await pool.query('SELECT * FROM proveedores ORDER BY codigo asc');
          if (rows.length === 0) {
            res.status(404).json({ error: 'Proveedores no encontrado' });
          } else {
            return rows
          }
          } catch (error) {
            res.render("error", { message: "Error al cargar los Proveedores" });
          }
    },
    obtenerProveedores2: async (req, res) => {
        try {
          const { rows } = await pool.query('SELECT * FROM proveedores ORDER BY codigo asc');
          if (rows.length === 0) {
            res.status(404).json({ error: 'Proveedores no encontrados' });
          } else {
            res.json(rows)
          }
          } catch (error) {
            res.render("error", { message: "Error al cargar los Proveedores" });
          }
    },

    obtenerProveedor: async (id) => {
        try {
            const proveedor = await pool.query( `SELECT * FROM proveedores WHERE codigo = ${id}`);
            const bancos = await pool.query(`SELECT * FROM bancos`);            
            const consulta = [proveedor,bancos]
            return consulta
      } catch (error) {
          return("error", { message: "Error al cargar el Proveedor" });
      }
    },

    crearProveedor: async (datosProveedor) => {
      const { rif, razonsocial, direccion, web, email, banco, cuenta, telefono } = datosProveedor;
      try {
          await pool.query(
            `INSERT INTO proveedores (rif, razon_social, direccion, web, correo, banco, numerocuenta, telefono, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${rif}', '${razonsocial}', '${direccion}', '${web}', '${email}', '${banco}', '${cuenta}', '${telefono}', current_timestamp,NULL, 1)`
            
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

    modificarProveedor: async (datosProveedor) => {
      const { id, rif, razon_social, direccion, web, email, banco, cuenta, telefono } = datosProveedor;

      try {
          // Obtener los datos actuales del proveedor
          const { rows } = await pool.query(
              `SELECT rif, razon_social, direccion, web, correo, banco, numerocuenta, telefono FROM proveedores WHERE codigo = ${id}`
          );        
  
          if (rows.length === 0) {
              return { success: false, message: "Proveedor no encontrado." };
          }
  
        const proveedorActual = rows[0];
  
          // Verificar si los datos han cambiado
          if (
              proveedorActual.rif === rif &&
              proveedorActual.razon_social === razon_social &&
              proveedorActual.direccion === direccion &&
              proveedorActual.web === web &&
              proveedorActual.correo === email &&
              proveedorActual.banco === banco &&
              proveedorActual.numerocuenta === cuenta &&
              proveedorActual.telefono === telefono
          ) {
              return { success: false, message: "No se realizaron cambios." };
          }
          
        
          // Actualizar los datos si hay cambios
          await pool.query(
              `UPDATE proveedores
               SET rif = '${rif}', razon_social = '${razon_social}', direccion = '${direccion}', web = '${web}', correo = '${email}', banco = '${banco}', numerocuenta = '${cuenta}', telefono = '${telefono}', fecha_modificacion = current_timestamp
               WHERE codigo = ${id}`);
  
          return { success: true, message: 'Proveedor modificado exitosamente' };
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

    eliminarProveedor: async (codigo) => {    
      try {
          await pool.query(`DELETE FROM proveedores WHERE codigo = ${codigo}`);       
      } catch (error) {
        return("error", { message: "Error al eliminar el Proveedor." });
      }    
    },

    obtenerBancos: async (req, res) => {
        try {
            const bancos = await pool.query("SELECT * FROM bancos");
            return bancos
          } catch (error) {
            res.render("error", { message: "Error al cargar los Bancos" });
          }
    },

}

module.exports = proveedoresController;