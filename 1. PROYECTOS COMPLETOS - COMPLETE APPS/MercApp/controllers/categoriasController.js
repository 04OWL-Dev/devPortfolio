const pool = require('../config/database');

const categoriasController = {
  obtenerCategorias: async (req, res) => {

    try {
      const { rows } = await pool.query('SELECT * FROM categorias ORDER BY codigo asc');
      if (rows.length === 0) {  
        const error = 'Categoria no encontrada'    
        return error;
      } else {        
        return rows;
      }
    } catch (error) {
        res.render("error", { message: "Error al cargar las categorias" });
    }
  },

  obtenerCategorias2: async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM categorias ORDER BY codigo asc');
      if (rows.length === 0) {
        res.status(404).json({ error: 'Categorias no encontradas' });
      } else {
        res.json(rows)
      }
      } catch (error) {
        res.render("error", { message: "Error al cargar las Categorias" });
      }
  },

  obtenerCategoria: async (id) => {

    try {
      const { rows } = await pool.query(`SELECT * FROM categorias WHERE codigo = ${id}`);
      if (rows.length === 0) {  
        const error = 'Categoria no encontrada'    
        return error;
      } else {      
        return {
          categoria: rows[0]
        } 
      }
    } catch (error) {
        return("error", { message: "Error al cargar la categoria" });
    }
  },

  crearCategoria: async (datosCategoria) => {
    const { nombre, descripcion } = datosCategoria;

    try {
        await pool.query(
        `INSERT INTO categorias(nombre, descripcion, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${nombre}', '${descripcion}', current_timestamp,NULL, 1)`
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

  modificarCategoria : async (datosCategoria) => {
    const { id, nombre, descripcion } = datosCategoria;

    try {
        // Obtener los datos actuales de la categoría
        const { rows } = await pool.query(
            `SELECT nombre, descripcion FROM categorias WHERE codigo = ${id}`
        );

        if (rows.length === 0) {
            return { success: false, message: "Categoría no encontrada." };
        }

        const categoriaActual = rows[0];

        // Verificar si los datos han cambiado
        if (
            categoriaActual.nombre === nombre &&
            categoriaActual.descripcion === descripcion
        ) {
            return { success: false, message: "No se realizaron cambios." };
        }

        // Actualizar los datos si hay cambios
        await pool.query(
            `UPDATE categorias
             SET nombre = '${nombre}', descripcion = '${descripcion}', fecha_modificacion = current_timestamp
             WHERE codigo = ${id}`
        );

        return { success: true, message: 'Categoría modificada exitosamente' };
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

  eliminarCategoria: async (codigo) => {
    
    try {
        await pool.query(`DELETE FROM categorias WHERE codigo = ${codigo}`);       
    } catch (error) {
      return("error", { message: "Error al agregar el producto" });
    }    
  },
   
};

module.exports = categoriasController;