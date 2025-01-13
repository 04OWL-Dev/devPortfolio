const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const ventasController = require('../controllers/ventasController');
const clientesController = require('../controllers/clientesController');


const fs = require("fs");
const path = require("path");
const PDFDocument = require('pdfkit');
const comprasController = require('../controllers/comprasController');

router.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});


router.get("/notaEntrega/:id", async (req, res) => {
    const id = req.params.id;
    
    try {
        const datosVenta = await ventasController.obtenerVenta(id);
        const cliente = await clientesController.obtenerCliente(datosVenta.encabezado.codigo_cliente);
        const logoPath = './public/img/logo.png';
    
        // Crear un nuevo documento PDF
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const doc = new PDFDocument({ margin: 30 });
    
        // Establecer la cabecera de la respuesta para mostrar el PDF en el navegador
        res.setHeader('Content-Disposition', `inline; filename="notaDeEntrega_${id}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
    
        // Canalizar el PDF a la respuesta
        doc.pipe(res);
    
        // Añadir el logo si existe, alineado a la izquierda
        if (fs.existsSync(logoPath)) {
            const logoWidth = 120;
            const logoHeight = 70;
            const logoX = doc.page.margins.left; // Alineado a la izquierda, justo después de los márgenes izquierdos
            const logoY = doc.page.margins.top;
            doc.image(logoPath, logoX, logoY, { width: logoWidth, height: logoHeight });
        }
    
        // Información de la Empresa
        doc.moveDown(2);
        doc.fontSize(12).text('Elevate Bike', { align: 'right' });
        doc.text('N° 55, antigua Calle Retiro. Av. Bolívar, Maturín', { align: 'right' });
        doc.text('Teléfono: 416-486-0806', { align: 'right' });
        doc.moveDown();
    
        // Información del Cliente
        doc.fontSize(12).text('Datos del Cliente', { underline: true });
        doc.text(`Nombre: ${cliente.nombre}`, { align: 'left' });
        doc.text(`Dirección: ${cliente.direccion}`, { align: 'left' });
        doc.text(`Teléfono: ${cliente.telefono}`, { align: 'left' });
        doc.moveDown();
    
        // Función para dibujar una tabla
        function drawTable(doc, startX, startY, rowHeight, rows) {
            // Ajustar los anchos de las columnas para que el contenido no se desborde
            const colWidths = [220, 90, 90, 90];  // Reducido el ancho total de la tabla
            const colX = [startX, startX + colWidths[0], startX + colWidths[0] + colWidths[1], startX + colWidths[0] + colWidths[1] + colWidths[2]];
    
            // Dibujar encabezados
            doc.rect(startX, startY, colWidths.reduce((a, b) => a + b), rowHeight).stroke();
            doc.text('Producto', colX[0] + 5, startY + 5, { width: colWidths[0] - 10 });
            doc.text('Cantidad', colX[1] + 5, startY + 5, { width: colWidths[1] - 10 });
            doc.text('Precio', colX[2] + 5, startY + 5, { width: colWidths[2] - 10 });
            doc.text('Total', colX[3] + 5, startY + 5, { width: colWidths[3] - 10 });
    
            // Dibujar filas
            let currentY = startY + rowHeight;
            rows.forEach(prod => {
                doc.rect(startX, currentY, colWidths.reduce((a, b) => a + b), rowHeight).stroke();
                doc.text(prod.nombre, colX[0] + 5, currentY + 5, { width: colWidths[0] - 10 });
                doc.text(prod.cantidad.toString(), colX[1] + 5, currentY + 5, { width: colWidths[1] - 10 });
                doc.text(prod.precio.toFixed(2), colX[2] + 5, currentY + 5, { width: colWidths[2] - 10 });
                doc.text(`${prod.total.toFixed(2)}$`, colX[3] + 5, currentY + 5, { width: colWidths[3] - 10 });
                currentY += rowHeight;
            });
    
            return currentY;
        }
    
        // Preparar datos de productos para la tabla
        const rows = datosVenta.detalle.map(detalle => ({
            nombre: detalle.nombre_producto,
            cantidad: detalle.cantidad,
            precio: detalle.precio,
            total: detalle.total
        }));
    
        // Dibujar tabla de productos
        const startXTable = 40;
        const startYTable = doc.y;
        const rowHeightTable = 20;
        const endYTable = drawTable(doc, startXTable, startYTable, rowHeightTable, rows);
    
        // Mostrar total de la factura, alineado con la tabla
        doc.fontSize(12).text(`Total: ${datosVenta.encabezado.total_venta.toFixed(2)}$`, { align: 'left', indent: startXTable + 220 + 90 + 90 + 5 });  // Alineado con la tabla
    
        // Finalizar el documento PDF
        doc.end();
    } catch (err) {
        console.error('Error al consultar la base de datos o generar el PDF:', err);
        res.status(500).send('Error al generar la nota de entrega');
    } 
});

/* REPORTES DE COMPRAS ---------------------------------------- */
router.post('/reporteCompras', async (req, res) => {
    try {
        const { fechaInicio, fechaFin, tipo } = req.body;
        
        // Redirigir a la vista del reporte de compras con las fechas seleccionadas
        res.json({ redirectUrl: `/reportes/reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&tipo=${tipo}` });
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send('Error al generar el reporte de compras');
    }
});

// Nueva ruta para servir la vista con el PDF
router.get('/reporte', async (req, res) => {
    const { fechaInicio, fechaFin, tipo } = req.query;
    res.render('reportes/reporte', {
        showPDF: true,
        fechaInicio,
        fechaFin,
        tipo,
        session: req.session
    });
});

router.get('/reportePDF', async (req, res) => {
    try {
        const { fechaInicio, fechaFin, tipo } = req.query; // Recibir fechas como query params
        let datos;
        
        if (tipo === "1") {
            datos = await comprasController.datoReporteCompras(fechaInicio, fechaFin);
        } else if (tipo === "2") {
            datos = await ventasController.datoReporteVentas(fechaInicio, fechaFin);
        }

        const datosFiltrados = datos.rows;

        const logoPath = './public/img/logo.png';
        const PDFDocument = require('pdfkit');
        const fs = require('fs');
        const doc = new PDFDocument({ margin: 30 });

        // Configurar los encabezados de respuesta para indicar que es un PDF
        res.setHeader('Content-Disposition', `inline; filename="reporte_${tipo === "1" ? 'Compras' : 'Ventas'}_${fechaInicio}_${fechaFin}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        // Añadir logo si existe
        if (fs.existsSync(logoPath)) {
            const logoWidth = 120;
            const logoHeight = 70;
            const logoX = doc.page.margins.left;
            const logoY = doc.page.margins.top;
            doc.image(logoPath, logoX, logoY, { width: logoWidth, height: logoHeight });
        }

        // Añadir título al reporte
        doc.moveDown(2);
        doc.fontSize(16).text(`Reporte de ${tipo === "1" ? 'Compras' : 'Ventas'}`, { align: 'center' });
        doc.moveDown(2);

        // Función para dibujar tabla
        function drawTable(doc, startX, startY, rowHeight, rows) {
            const colWidths = [150, 170, 120, 100]; // Ajuste de anchos de columna según el orden: código, proveedor (o nombre), fecha, total
            const colX = [startX, startX + colWidths[0], startX + colWidths[0] + colWidths[1], startX + colWidths[0] + colWidths[1] + colWidths[2]];

            doc.rect(startX, startY, colWidths.reduce((a, b) => a + b), rowHeight).stroke();
            doc.text('Código', colX[0] + 5, startY + 5, { width: colWidths[0] - 10 });
            doc.text(tipo === "1" ? 'Proveedor' : 'Cliente', colX[1] + 5, startY + 5, { width: colWidths[1] - 10 });
            doc.text('Fecha', colX[2] + 5, startY + 5, { width: colWidths[2] - 10 });
            doc.text('Total', colX[3] + 5, startY + 5, { width: colWidths[3] - 10 });

            let currentY = startY + rowHeight;
            rows.forEach(item => {
                doc.rect(startX, currentY, colWidths.reduce((a, b) => a + b), rowHeight).stroke();
                doc.text(item.codigo, colX[0] + 5, currentY + 5, { width: colWidths[0] - 10 });
                if (tipo === "1") {
                    doc.text(item.razon_social, colX[1] + 5, currentY + 5, { width: colWidths[1] - 10 });
                    doc.text(`${item.total_compra.toFixed(2)}$`, colX[3] + 5, currentY + 5, { width: colWidths[3] - 10 });
                } else if (tipo === "2") {
                    doc.text(item.nombre, colX[1] + 5, currentY + 5, { width: colWidths[1] - 10 });
                    doc.text(`${item.total_venta.toFixed(2)}$`, colX[3] + 5, currentY + 5, { width: colWidths[3] - 10 });
                }
                doc.text(new Date(item.fecha_creacion).toLocaleDateString(), colX[2] + 5, currentY + 5, { width: colWidths[2] - 10 });
                currentY += rowHeight;
            });

            return currentY;
        }

        // Mapear datos según el tipo de reporte
        const rows = datosFiltrados.map(item => {
            if (tipo === "1") {
                return {
                    codigo: item.codigo,
                    total_compra: item.total_compra,
                    fecha_creacion: item.fecha_creacion,
                    razon_social: item.razon_social
                };
            } else if (tipo === "2") {
                return {
                    codigo: item.codigo,
                    total_venta: item.total_venta, // Ajusta según el nombre exacto del campo para total de venta
                    fecha_creacion: item.fecha_creacion,
                    nombre: item.nombre // Ajusta según el nombre exacto del campo para el nombre del cliente
                };
            }
        });

        const startXTable = 40;
        const startYTable = doc.y;
        const rowHeightTable = 20;
        drawTable(doc, startXTable, startYTable, rowHeightTable, rows);

        doc.end();
    } catch (err) {
        console.error('Error al consultar la base de datos o generar el PDF:', err);
        res.status(500).send('Error al generar el reporte');
    }
});

/* REPORTES DE COMPRAS ---------------------------------------- */
    
    


  
module.exports = router;