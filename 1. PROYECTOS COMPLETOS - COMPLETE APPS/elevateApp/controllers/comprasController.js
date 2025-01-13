const pool = require('../config/database');

const comprasController = {

    obtenerCompras: async (req, res) => {
        try {
          const { rows } = await pool.query('SELECT * FROM compras ORDER BY codigo asc');
          if (rows.length === 0) {
            res.status(404).json({ error: 'Compras no encontradas' });
          } else {
            return rows
          }
          } catch (error) {
            res.render("error", { message: "Error al cargar las Compras" });
          }
    },
    obtenerComprasJSON: async (req, res) => {
        try {
          const { rows } = await pool.query("SELECT codigo, total_compra, TO_CHAR(fecha_creacion, 'DD/MM/YYYY') AS fechan FROM encabezado_compras ORDER BY codigo asc");
          if (rows.length === 0) {
            res.status(404).json({ error: 'Compras no encontradas' });
          } else {
           
            res.json(rows)
          }
          } catch (error) {
            res.render("error", { message: "Error al cargar las Compras" });
          }
    },

    obtenerCompra: async (id) => {
  
        try {            
            const encabezado = await pool.query(`SELECT ec.codigo, ec.codigo_proveedor, ec.total_compra, TO_CHAR(ec.fecha_creacion, 'YYYY-MM-DD') AS fechac, pr.razon_social FROM encabezado_compras ec LEFT JOIN proveedores pr ON ec.codigo_proveedor = pr.codigo WHERE ec.codigo = '${id}'`);   

          /*   const encabezadoCompra = {
                codigo: encabezadoCompraQuery.rows[0].codigo, 
                codigo_proveedor: encabezadoCompraQuery.rows[0].codigo_proveedor,
                razon_social: encabezadoCompraQuery.rows[0].razon_social,
                total_compra: encabezadoCompraQuery.rows[0].total_compra,
                fecha: encabezadoCompraQuery.rows[0].fecha.toLocaleDateString('en-US'),
            } */

            const detalle =  await pool.query(`SELECT dc.codigo_ecompra,dc.codigo_producto,p.nombre AS nombre_producto,p.marca AS marca_producto,p.modelo AS modelo_producto, dc.precio,dc.cantidad,dc.total,dc.fecha_creacion,dc.usuario_modificador 
            FROM detalles_compra dc 
            LEFT JOIN productos p ON dc.codigo_producto = p.codigo
	          WHERE dc.codigo_ecompra = '${id}'
            ORDER BY dc.codigo_ecompra;`)           

            
            const datos = {encabezado : encabezado.rows[0], detalle: detalle.rows}            
            return datos

      } catch (error) {
          return("error", { message: "Error al cargar la Compra" + error });
      }
    },

    crearCompra: async (req,res) => {
        try {
            const codigo = await pool.query('SELECT get_compra_id()')                      
          
    
            const proveedores = await pool.query("SELECT * FROM proveedores ORDER BY codigo asc");        
            const productos = await pool.query("SELECT * FROM productos ORDER BY codigo asc");

            const consulta = {
              codigo: codigo.rows[0].get_compra_id,
              proveedores: proveedores.rows,
              productos: productos.rows
            }        
            return consulta
          } catch (error) {
            res.render("error", { message: "Error al cargar el formulario de creación de Compra" + error});
          }
  },
    

  modificarCompra: async (cuerpo) => {
    try {
        const {
            codigo,
            codigo_proveedor,
            totalCompra,
            fechaCompra,
            productos
        } = cuerpo;

        // Validar datos esenciales
        if (!codigo || !totalCompra || !productos || productos.length === 0) {
            return { success: false, message: "Datos incompletos para modificar la compra." };
        }

        const compraActual = await pool.query(
            `SELECT * FROM encabezado_compras WHERE codigo = $1`, [codigo]
        );

        if (compraActual.rows.length === 0) {
            return { success: false, message: "Compra no encontrada." };
        }

        const compraActualDatos = compraActual.rows[0];

        // Verificar si los datos han cambiado
        if (compraActualDatos.total_compra == totalCompra) {
            return { success: false, message: "No se realizaron cambios." };
        }

        await pool.query(`UPDATE encabezado_compras SET total_compra = $1, fecha_modificacion = current_timestamp, usuario_modificador = NULL WHERE codigo = $2`, [totalCompra, codigo]);

        for (const producto of productos) {
            const { codigo_producto, cantidad, precio_compra, total } = producto;

            const result = await pool.query(`SELECT * FROM detalles_compra WHERE codigo_producto = $1 AND codigo_ecompra = $2`, [codigo_producto, codigo]);

            const existenciasResult = await pool.query(`SELECT existencias FROM productos WHERE codigo = $1`, [codigo_producto]);
            const existencias = existenciasResult.rows[0].existencias;

            const existenciasPreviasBDResult = await pool.query(`SELECT cantidad FROM detalles_compra WHERE codigo_producto = $1 AND codigo_ecompra = $2`, [codigo_producto, codigo]);
            const existenciasPreviasBD = existenciasPreviasBDResult.rows.length > 0 ? existenciasPreviasBDResult.rows[0].cantidad : 0;

            const diferencia = cantidad - existenciasPreviasBD;

            if (result.rows.length > 0) {
                await pool.query('UPDATE detalles_compra SET cantidad = $1, total = $2 WHERE codigo_ecompra = $3 AND codigo_producto = $4', [cantidad, total, codigo, codigo_producto]);
                await pool.query(`UPDATE productos SET existencias = $1 WHERE codigo = $2`, [existencias + diferencia, codigo_producto]);
            } else {
                await pool.query(`INSERT INTO detalles_compra(codigo_ecompra, codigo_producto, precio, cantidad, total, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ($1, $2, $3, $4, $5, $6, current_timestamp, NULL)`, [codigo, codigo_producto, precio_compra, cantidad, total, fechaCompra]);
                await pool.query(`UPDATE productos SET existencias = $1 WHERE codigo = $2`, [existencias + diferencia, codigo_producto]);
            }
        }

        const BD = await pool.query(`SELECT * FROM detalles_compra WHERE codigo_ecompra = $1`, [codigo]);
        for (const registro of BD.rows) {
            let i = 0;
            let cantidad = 0;
            for (const producto of productos) {
                if (registro.codigo_producto == producto.codigo_producto) {
                    i++;
                }
            }
            if (i == 0) {
                cantidad = registro.cantidad;
                await pool.query(`DELETE FROM detalles_compra WHERE codigo_producto = $1 AND codigo_ecompra = $2`, [registro.codigo_producto, codigo]);
                await pool.query(`UPDATE productos SET existencias = existencias - $1 WHERE codigo = $2`, [cantidad, registro.codigo_producto]);
            }
        }

        return { success: true, message: "Compra modificada exitosamente." };

    } catch (error) {
        console.error('Error en modificarCompra:', error);
        return { success: false, message: "Error al modificar datos de la Compra." };
    }
},

    eliminarCompra: async (codigo) => {    
      try {
   
        const productos = await pool.query(`SELECT codigo_producto, cantidad FROM detalles_compra WHERE codigo_ecompra = '${codigo}'`);
        console.log(productos.rows)

        productos.rows.forEach(async producto => {
          await pool.query(`UPDATE productos SET existencias = existencias - ${producto.cantidad} WHERE codigo = ${producto.codigo_producto};`)
        })        

        await pool.query(`DELETE FROM encabezado_compras WHERE codigo = '${codigo}'`); 
        await pool.query(`DELETE FROM detalles_compra WHERE codigo_ecompra = '${codigo}'`);   
            
      } catch (error) {
        return("error", { message: "Error al eliminar la Compra." });
      }    
    },

  autoCompleteProveedoresA: async (req, res) => {
    try {
      const term = req.query.term.toLowerCase();
      let query = `SELECT codigo, razon_social FROM proveedores WHERE `;
      if (!isNaN(term)) {
        query += ` codigo = ${term} OR `;
      }
      query += `LOWER(razon_social) LIKE '%${term}%' OR LOWER(rif) LIKE '%${term}%' ORDER BY razon_social ASC`;
      console.log(query);
      const proveedores = await pool.query(query);
      console.log(proveedores.rows);
      res.json(proveedores.rows);
    } catch (error) {
      console.error('Error en autoComplete:', error);
      res.status(500).json({ error: 'Error al realizar la consulta de autocompletar' });
    }
  },  
   

  autoCompleteProveedoresB: async (req, res) => {
    const codigo = req.query.codigo; // Usar 'codigo' en lugar de 'term'
    let query = `SELECT codigo, razon_social FROM proveedores WHERE codigo = $1 ORDER BY razon_social ASC`;
    const values = [codigo];
    try {
        const proveedores = await pool.query(query, values);
        res.json(proveedores.rows);
    } catch (error) {
        console.error('Error ejecutando la consulta:', error);
        res.status(500).send('Error en el servidor');
    }
}, 

autoCompleteProductosA: async (req, res) => {
  try {
      const term = req.query.term.toLowerCase();
      let query = `SELECT codigo, nombre, precio_compra FROM productos WHERE `;
      if (!isNaN(term)) {
          query += ` codigo = ${term} OR `;
      }
      query += `LOWER(nombre) LIKE '%${term}%' ORDER BY nombre ASC`;
      console.log(query);
      const productos = await pool.query(query);
      console.log(productos.rows);
      res.json(productos.rows);
  } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      res.status(500).send('Error en el servidor');
  }
}, 

autoCompleteProductosB: async (req, res) => {
  const codigo = req.query.codigo; // Usar 'codigo' en lugar de 'term'
  let query = `SELECT codigo, nombre, precio_compra FROM productos WHERE codigo = $1 ORDER BY nombre ASC`;
  const values = [codigo];
  try {
      const productos = await pool.query(query, values);
      res.json(productos.rows);
  } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      res.status(500).send('Error en el servidor');
  }
},

registrarCompra : async (datosCompra) => {
 
  try {
      // Obtener el último código de compra registrado
      const codigoActualQuery = await pool.query('SELECT get_compra_id()');//Función SQl
      let codigoActual = codigoActualQuery.rows[0].get_compra_id
      
    const {codigo_proveedor, fechaCompra, totalCompra, productos} = datosCompra

    const a = await pool.query(`INSERT INTO encabezado_compras (codigo, codigo_proveedor, total_compra, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${codigoActual}', '${codigo_proveedor}', '${totalCompra}', '${fechaCompra}', NULL, NULL)`);  
      

      for (let producto of productos) {
        const { codigo_producto, precio_compra, cantidad, total } = producto;
        
        let existenciasActuales = await pool.query(`SELECT existencias FROM productos WHERE codigo = ${codigo_producto};`)

        if (existenciasActuales.rows.length > 0) {
          existenciasActuales = existenciasActuales.rows[0].existencias;
          existenciasActuales += cantidad;

          await pool.query(`INSERT INTO detalles_compra(codigo_ecompra, codigo_producto, precio, cantidad, total, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${codigoActual}', ${codigo_producto}, '${precio_compra}', '${cantidad}', '${total}', '${fechaCompra}', NULL, NULL)`);

          await pool.query(`UPDATE productos SET existencias = ${existenciasActuales} WHERE codigo = ${codigo_producto}`);          

        } else {
          await pool.query(`INSERT INTO detalles_compra(codigo_ecompra, codigo_producto, precio, cantidad, total, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${codigoActual}', ${codigo_producto}, '${precio_compra}', '${cantidad}', '${total}', '${fechaCompra}', NULL, NULL)`); 
        }
        
        console.log(existenciasActuales)       
             
    }
    
  }catch (error) {      
      console.error('Error al registrar la compra', error.message);
      res.status(500).send('Error al registrar la compra');
  }
  },

  datoReporteCompras: async (fechaInicio,fechaFin) => {
    
    try {
      const datos = await pool.query(`SELECT ec.codigo, ec.total_compra, ec.fecha_creacion, p.razon_social FROM encabezado_compras ec JOIN proveedores p ON ec.codigo_proveedor = p.codigo WHERE ec.fecha_creacion BETWEEN '${fechaInicio}' AND '${fechaFin}';`)
      return datos;
    } catch (err) {
      res.status(500).send('Error al generar el reporte ' + err);
    }
    
  }

}

module.exports = comprasController








