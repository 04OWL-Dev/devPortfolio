const pool = require('../config/database');
const fs = require("fs");
const path = require("path");
const PDFDocument = require('pdfkit');

const ventasController = {

  obtenerVentasJSON: async (req, res) => {
    try {
      const { rows } = await pool.query("SELECT codigo, total_venta, TO_CHAR(fecha_creacion, 'DD/MM/YYYY') AS fechan FROM encabezado_ventas ORDER BY codigo asc");
      if (rows.length === 0) {
        res.status(404).json({ error: 'Ventas no encontradas' });
      } else {
           
        res.json(rows)
      }
    } catch (error) {
      res.render("error", { message: "Error al cargar las Ventas" });
    }
  },
  
  obtenerVentasClientes: async (req, res) => {
  
    try {
      let datosTabla = await pool.query(`SELECT e.codigo, e.codigo_cliente, e.total_venta, e.fecha_creacion, c.nombre AS nombre_cliente FROM public.encabezado_ventas e JOIN public.clientes c ON e.codigo_cliente = c.codigo ORDER BY e.codigo DESC LIMIT 9;`)
      datosTabla = datosTabla.rows;
      console.log(datosTabla)
      return datosTabla
    } catch (err) {
      console.log('Error en el controlador de ventas' + err)
    }

  },

  crearVenta: async (req, res) => {
    try {
      const codigo = await pool.query('SELECT get_venta_id()')  
      const clientes = await pool.query("SELECT * FROM clientes ORDER BY codigo asc");
      const productos = await pool.query("SELECT * FROM productos ORDER BY codigo asc");

      const consulta = {
        codigo: codigo.rows[0].get_venta_id,
        clientes: clientes.rows,
        productos: productos.rows
      }
      return consulta
    } catch (error) {
      res.render("error", { message: "Error al cargar el formulario de creación de Compra" + error });
    }
  },

  autoCompleteClientesA: async (req, res) => {
    try {
      const term = req.query.term.toLowerCase();
      let query = `SELECT codigo, nombre FROM clientes WHERE `;
      if (!isNaN(term)) {
        query += ` codigo = ${term} OR `;
      }
      query += `LOWER(nombre) LIKE '%${term}%' OR LOWER(cedula) LIKE '%${term}%' ORDER BY nombre ASC`;
      
      const clientes = await pool.query(query);
      
      res.json(clientes.rows);
    } catch (error) {
      console.error('Error en autoComplete:', error);
      res.status(500).json({ error: 'Error al realizar la consulta de autocompletar' });
    }
  },
  
  autoCompleteClientesB: async (req, res) => {
    const codigo = req.query.codigo; // Usar 'codigo' en lugar de 'term'
    let query = `SELECT codigo, nombre FROM clientes WHERE codigo = $1 ORDER BY nombre ASC`;
    const values = [codigo];
    try {
      const clientes = await pool.query(query, values);
      res.json(clientes.rows);
    } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      res.status(500).send('Error en el servidor');
    }
  },
  
  autoCompleteProductosA: async (req, res) => {
    try {
      const term = req.query.term.toLowerCase();
      let query = `SELECT codigo, nombre, precio_venta FROM productos WHERE `;
      if (!isNaN(term)) {
        query += ` codigo = ${term} OR `;
      }
      query += `LOWER(nombre) LIKE '%${term}%' ORDER BY nombre ASC`;
      
      const productos = await pool.query(query);
      
      res.json(productos.rows);
    } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      res.status(500).send('Error en el servidor');
    }
  },
  
  autoCompleteProductosB: async (req, res) => {
    const codigo = req.query.codigo; // Usar 'codigo' en lugar de 'term'
    let query = `SELECT codigo, nombre, precio_venta FROM productos WHERE codigo = $1 ORDER BY nombre ASC`;
    const values = [codigo];
    try {
      const productos = await pool.query(query, values);
      res.json(productos.rows);
    } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  registrarVenta: async (datosVenta) => { 

    try {
     
      const { codigo, codigo_cliente, totalVenta, totalDebito, totalCredito, totalEfectivo, totalDivisas, totalBiopago, totalPgmovil, valorDivisa, fechaVenta, totalDeuda, totalDescuento, totalVuelto, productos } = datosVenta      

      await pool.query(`INSERT INTO encabezado_ventas(codigo, codigo_cliente, total_venta, total_debito, total_credito, total_efectivo, total_divisa, total_biopago, total_pgmovil, total_descuento, total_deuda, total_vuelto, precio_divisa, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${codigo}',${codigo_cliente}, ${totalVenta}, ${totalDebito}, ${totalCredito}, ${totalEfectivo}, ${totalDivisas}, ${totalBiopago}, ${totalPgmovil},${totalDescuento}, ${totalDeuda},${totalVuelto} , ${valorDivisa}, '${fechaVenta}', NULL, NULL)`);
  
      for (let producto of productos) {
        const { codigo_producto, precio_venta, cantidad, total } = producto;

        await pool.query(`INSERT INTO detalles_venta (codigo_eventa, codigo_producto, precio, cantidad, total, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${codigo}', ${codigo_producto}, ${precio_venta}, ${cantidad}, ${total}, '${fechaVenta}', NULL, NULL)`);

        let existencias = await pool.query(`SELECT existencias FROM productos WHERE codigo = ${codigo_producto};`)
        existencias = existencias.rows[0].existencias;
        
        await pool.query(`UPDATE productos SET existencias = ${existencias - cantidad} WHERE codigo = ${codigo_producto};`)
      }
    } catch (error) {        
      console.error('Error al registrar la venta', error.message);      
    }
  },

  obtenerVenta: async (id) => {
  
    try {            
        const encabezado = await pool.query(`SELECT ev.codigo, ev.codigo_cliente, ev.total_venta, ev.precio_divisa, ev.total_debito, ev.total_credito, ev.total_efectivo, ev.total_divisa, ev.total_biopago, ev.total_pgmovil, ev.total_descuento, ev.total_deuda, ev.total_vuelto, TO_CHAR(ev.fecha_creacion, 'YYYY-MM-DD') AS fechac, ev.precio_divisa, cl.nombre FROM encabezado_ventas ev LEFT JOIN clientes cl ON ev.codigo_cliente = cl.codigo WHERE ev.codigo = '${id}'`);   

      /*   const encabezadoCompra = {
            codigo: encabezadoCompraQuery.rows[0].codigo, 
            codigo_proveedor: encabezadoCompraQuery.rows[0].codigo_proveedor,
            razon_social: encabezadoCompraQuery.rows[0].razon_social,
            total_compra: encabezadoCompraQuery.rows[0].total_compra,
            fecha: encabezadoCompraQuery.rows[0].fecha.toLocaleDateString('en-US'),
        } */

        const detalle =  await pool.query(`SELECT dv.codigo_eventa,dv.codigo_producto,p.nombre AS nombre_producto,p.marca AS marca_producto,p.modelo AS modelo_producto, dv.precio,dv.cantidad,dv.total,dv.fecha_creacion,dv.usuario_modificador 
        FROM detalles_venta dv 
        LEFT JOIN productos p ON dv.codigo_producto = p.codigo
        WHERE dv.codigo_eventa = '${id}'
        ORDER BY dv.codigo_eventa;`)
        
        const datos = {encabezado : encabezado.rows[0], detalle: detalle.rows}            
        return datos

  } catch (error) {
      return("error", { message: "Error al cargar la Compra" + error });
  }
  },
  
  eliminarVenta: async (codigo) => {
    try {
      const productos = await pool.query(`SELECT codigo_producto, cantidad FROM detalles_venta WHERE codigo_eventa = '${codigo}'`);
      

      productos.rows.forEach(async producto => {
        await pool.query(`UPDATE productos SET existencias = existencias + ${producto.cantidad} WHERE codigo = ${producto.codigo_producto};`)
      })        

      await pool.query(`DELETE FROM encabezado_ventas WHERE codigo = '${codigo}'`); 
      await pool.query(`DELETE FROM detalles_venta WHERE codigo_eventa = '${codigo}'`);
      

    } catch (error) {
      return("error", { message: "Error al eliminar la Venta." });
    }    
  },

  modificarVenta: async (datosVenta) => {
    try {
        const {
            codigo,
            codigo_cliente,
            totalVenta,
            totalDebito,
            totalCredito,
            totalEfectivo,
            totalDivisas,
            totalBiopago,
            totalPgmovil,
            valorDivisa,
            fechaVenta,
            totalDeuda,
            totalDescuento,
            totalVuelto,
            productos
        } = datosVenta;

        // Validar datos esenciales
        if (!codigo || !totalVenta || !productos || productos.length === 0) {
            return { success: false, message: "Datos incompletos para modificar la venta." };
        }

        const ventaActual = await pool.query(
            `SELECT * FROM encabezado_ventas WHERE codigo = $1`, [codigo]
        );

        if (ventaActual.rows.length === 0) {
            return { success: false, message: "Venta no encontrada." };
        }

        const ventaActualDatos = ventaActual.rows[0];

        // Verificar si los datos han cambiado
        if (ventaActualDatos.total_venta == totalVenta) {
            return { success: false, message: "No se realizaron cambios." };
        }

        await pool.query(`UPDATE encabezado_ventas SET total_venta=${totalVenta}, total_debito= ${totalDebito}, total_credito=${totalCredito}, total_efectivo=${totalEfectivo}, total_divisa=${totalDivisas}, total_biopago=${totalBiopago}, total_pgmovil=${totalPgmovil}, total_descuento=${totalDescuento}, total_deuda=${totalDeuda}, total_vuelto=${totalVuelto}, precio_divisa=${valorDivisa}, fecha_modificacion=current_timestamp, usuario_modificador= NULL WHERE codigo = codigo;`);

        for (const producto of productos) {
            const { codigo_producto, cantidad, precio_venta, total } = producto;

            const result = await pool.query(`SELECT * FROM detalles_venta WHERE codigo_producto = $1 AND codigo_eventa = $2`, [codigo_producto, codigo]);

            const existenciasResult = await pool.query(`SELECT existencias FROM productos WHERE codigo = $1`, [codigo_producto]);
            const existencias = existenciasResult.rows[0].existencias;

            const existenciasPreviasBDResult = await pool.query(`SELECT cantidad FROM detalles_venta WHERE codigo_producto = $1 AND codigo_eventa = $2`, [codigo_producto, codigo]);
            const existenciasPreviasBD = existenciasPreviasBDResult.rows.length > 0 ? existenciasPreviasBDResult.rows[0].cantidad : 0;

            const diferencia = cantidad - existenciasPreviasBD;

            if (result.rows.length > 0) {
                await pool.query('UPDATE detalles_venta SET cantidad = $1, total = $2 WHERE codigo_eventa = $3 AND codigo_producto = $4', [cantidad, total, codigo, codigo_producto]);
                await pool.query(`UPDATE productos SET existencias = $1 WHERE codigo = $2`, [existencias - diferencia, codigo_producto]);
            } else {
                await pool.query(`INSERT INTO detalles_venta(codigo_eventa, codigo_producto, precio, cantidad, total, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ($1, $2, $3, $4, $5, $6, current_timestamp, NULL)`, [codigo, codigo_producto, precio_venta, cantidad, total, fechaVenta]);
                await pool.query(`UPDATE productos SET existencias = $1 WHERE codigo = $2`, [existencias - diferencia, codigo_producto]);
            }
        }

        const BD = await pool.query(`SELECT * FROM detalles_venta WHERE codigo_eventa = $1`, [codigo]);
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
                await pool.query(`DELETE FROM detalles_venta WHERE codigo_producto = $1 AND codigo_eventa = $2`, [registro.codigo_producto, codigo]);
                await pool.query(`UPDATE productos SET existencias = existencias + $1 WHERE codigo = $2`, [cantidad, registro.codigo_producto]);
            }
        }

        return { success: true, message: "Venta modificada exitosamente." };

    } catch (error) {
        console.error('Error en modificarVenta:', error);
        return { success: false, message: "Error al modificar datos de la Venta." };
    }
},

  totales: async (req, res) => {    
    try {
      const datos = await pool.query(`SELECT * FROM ventas_por_mes(2024)`)//Estandarizar para actualizar el año automaticamente.
      /* console.log(datos.rows) */
      res.json(datos.rows);
    } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      res.status(500).send('Error en el servidor');
    }
  },

  comparativaMeses: async (req, res) => {
    try {
      
      const fechaActual = new Date();
      const añoActual = fechaActual.getFullYear();
      const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, así que sumamos 1

      let totalMesActual = await pool.query(`SELECT SUM(total_venta) AS total_actual FROM encabezado_ventas WHERE EXTRACT(YEAR FROM fecha_creacion) = ${añoActual} AND EXTRACT(MONTH FROM fecha_creacion) = ${mesActual};`)
      totalMesActual = totalMesActual.rows[0].total_actual || 0

      // Calcular el mes y año anterior
      const fechaMesAnterior = new Date(fechaActual);
      fechaMesAnterior.setMonth(fechaMesAnterior.getMonth() - 1);
      const añoMesAnterior = fechaMesAnterior.getFullYear();
      const mesMesAnterior = fechaMesAnterior.getMonth() + 1;

      // Consulta para el mes anterior
      console.log(`SELECT SUM(total_venta) AS total_anterior FROM encabezado_ventas WHERE EXTRACT(YEAR FROM fecha_creacion) = ${añoMesAnterior} AND EXTRACT(MONTH FROM fecha_creacion) = ${mesMesAnterior}`)
      let totalMesAnterior = await pool.query(`SELECT SUM(total_venta) AS total_anterior FROM encabezado_ventas WHERE EXTRACT(YEAR FROM fecha_creacion) = ${añoMesAnterior} AND EXTRACT(MONTH FROM fecha_creacion) = ${mesMesAnterior}`);
      totalMesAnterior = totalMesAnterior.rows[0].total_anterior || 0

      // Calcular la diferencia porcentual
      let diferenciaPorcentual = null;
      if (totalMesAnterior !== 0) {
          diferenciaPorcentual = parseInt((((totalMesActual - totalMesAnterior) / totalMesAnterior)) * 100) + "%";
      }
      
      return diferenciaPorcentual;

    } catch (err) {
      console.log('Error en el controlador de comparativa de meses' + err)
    }
  },

  totalAnual: async (req, res) => {
    try {
      let totalAnual = await pool.query(`SELECT SUM(total_venta) AS total_ventas_anual FROM encabezado_ventas WHERE EXTRACT(YEAR FROM fecha_creacion) = EXTRACT(YEAR FROM CURRENT_DATE);`)
      totalAnual = totalAnual.rows[0].total_ventas_anual;
      totalAnual = totalAnual ? '$' + totalAnual.toFixed(2) : '$0.00';
      return totalAnual
    } catch (err) {
      console.log('Error controlador totalAnual' + err)
    }
  },


  datoReporteVentas: async (fechaInicio,fechaFin) => {
    
    try {
      console.log(`SELECT ec.codigo, ec.total_venta, ec.fecha_creacion, c.nombre FROM encabezado_ventas ec JOIN clientes c ON ec.codigo_cliente = c.codigo WHERE ec.fecha_creacion BETWEEN '${fechaInicio}' AND '${fechaFin}';`)
      const datos = await pool.query(`SELECT ec.codigo, ec.total_venta, ec.fecha_creacion, c.nombre FROM encabezado_ventas ec JOIN clientes c ON ec.codigo_cliente = c.codigo WHERE ec.fecha_creacion BETWEEN '${fechaInicio}' AND '${fechaFin}';`)
      return datos;
    } catch (err) {
      res.status(500).send('Error al generar el reporte ' + err);
    }
    
  }

}

module.exports = ventasController