const pool = require('../config/database');

const productosController = {

  obtenerProductos1: async (req, res) => {

    try {
      const { rows } = await pool.query('SELECT * FROM productos WHERE estatus = true AND existencias > 0 ORDER BY codigo asc');
      if (rows.length === 0) {
        res.status(404).json({ error: 'Producto no encontrado' });
      } else {
        res.json(rows)
      }
      } catch (error) {
        res.render("error", { message: "Error al cargar los productos" });
      }
  },
  
  obtenerProductos: async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM productos WHERE estatus = true AND existencias > 0 ORDER BY codigo asc');
      if (rows.length === 0) {
        res.status(404).json({ error: 'Producto no encontrado' });
      } else {
        return rows
      }
      } catch (error) {
        res.render("error", { message: "Error al cargar los productos" });
      }
  },

  obtenerCodigoProducto: (callback) => {
    const query = "SELECT codigo FROM productos LIMIT 1"; // Cambia "productos" por el nombre de tu tabla de productos
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener el código del producto:", err);
        callback(err, null);
        return;
      }
      if (results.length === 0) {
        console.error("No se encontraron productos");
        callback(new Error("No se encontraron productos"), null);
        return;
      }  
      const codigo = results.codigo;
      callback(null, codigo);
    });
  }, 

  crearProducto: async (datosProducto) => {
    const {
      codigo_barras,
      nombre,
      marca,
      modelo,
      uso,
      categoria,
      existencias,
      minimo,
      cantidadMayor,
      pcompra,
      pventa,
      pmayor
    } = datosProducto;     

    try {      
      const nuevoProducto = await pool.query(
        `INSERT INTO productos (codigo_barras, nombre, marca, modelo, uso, categoria, existencias, minimo, cantidad_mayor, precio_compra, precio_venta, precio_mayor, estatus, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${codigo_barras}', '${nombre}', '${marca}', '${modelo}', '${uso}', '${categoria}', '${existencias}', '${minimo}', '${cantidadMayor}','${pcompra}', '${pventa}', '${pmayor}','true', current_timestamp,NULL, 1) RETURNING codigo`
      );      
      const {codigo} = nuevoProducto.rows[0];
      return { success: true, codigo };      
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

  obtenerProducto: async (codigo) => {    
    try {
      const { rows } = await pool.query(`SELECT * FROM productos WHERE codigo = ${codigo}`);    
      const categorias = await pool.query(`SELECT * FROM categorias`); 
      if (rows.length === 0) {
         return ({ error: 'Producto no encontrado' });
      } else {
        return {
          producto: rows[0], 
          categorias: categorias.rows
        }
      }
      } catch (error) {
        return ("error", { message: "Error al cargar el producto" });
      }
  },

  obtenerProductoDetalle: async (codigo) => {    
    try {
      const { rows } = await pool.query(`SELECT * FROM productos WHERE codigo = ${codigo}`);   
      const categoria = await pool.query(`SELECT * FROM categorias WHERE codigo = ${rows[0].categoria}`);
      if (rows.length === 0) {
         return ({ error: 'Producto no encontrado' });
      } else {
        return {
          producto: rows[0], 
          categoria: categoria.rows[0]
        }
      }
      } catch (error) {
        return ("error", { message: "Error al cargar el producto" });
      }
  },

  modificarProducto: async (producto) => {
    try {
      const {codigo, codigo_barras, nombre, marca,modelo,uso,categoria,existencias,minimo,pcompra,pventa} = producto;
      await pool.query(
        `UPDATE productos SET codigo_barras= '${codigo_barras}', nombre='${nombre}', marca='${marca}', modelo='${modelo}', uso='${uso}', categoria='${categoria}', existencias= '${existencias}', minimo= '${minimo}', precio_compra= '${pcompra}', precio_venta= '${pventa}',fecha_modificacion= current_timestamp WHERE codigo= '${codigo}'`
      );
    } catch (error) {
      return("error", { message: "Error al agregar el producto" });
    }    
  },

  eliminarProducto: async (codigo) => {    
    try {
        await pool.query(`UPDATE productos SET estatus = false WHERE codigo = ${codigo}`);              
    } catch (error) {
      return("error", { message: "Error al agregar el producto" });
    }    
  },

  productoAReactivar: async (codigo_barras) => {
    try {
      const { rows } = await pool.query(`SELECT codigo, nombre FROM productos WHERE codigo_barras = '${codigo_barras}' AND estatus = false`);
      if(rows.length > 0) {
        return rows[0];
      }
    } catch (error) {
      console.log('Error en el controlador productoAReactivar ' + error)
    }
  },

  reactivarProducto: async (codigo) => {    
    try {
      const reactivacion = await pool.query(`UPDATE productos SET estatus = true WHERE codigo = ${codigo}`);
      return reactivacion
    } catch (error) {
        return("error", { message: "Error al agregar el producto" });
    }    
  },



 /* obtenerProducto: async (req, res) => {
    const id = req.params.id;
    try {
      const { rows } = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
      if (rows.length === 0) {
        res.status(404).json({ error: 'Producto no encontrado' });
      } else {
        res.json(rows[0]);
      }
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }, 
 */
   /*crearProducto: async (req, res) => {
    const { nombre, descripcion, precio, cantidad } = req.body;
    try {
      const { rows } = await pool.query(
        'INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, descripcion, precio, cantidad]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
  actualizarProducto: async (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, precio, cantidad } = req.body;
    try {
      const { rowCount } = await pool.query(
        'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, cantidad = $4 WHERE id = $5',
        [nombre, descripcion, precio, cantidad, id]
      );
      if (rowCount === 0) {
        res.status(404).json({ error: 'Producto no encontrado' });
      } else {
        res.json({ message: 'Producto actualizado correctamente' });
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
  eliminarProducto: async (req, res) => {
    const id = req.params.id;
    try {
      const { rowCount } = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
      if (rowCount === 0) {
        res.status(404).json({ error: 'Producto no encontrado' });
      } else {
        res.json({ message: 'Producto eliminado correctamente' });
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }, */
};

module.exports = productosController;