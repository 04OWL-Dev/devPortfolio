const pool = require('../config/database');
const fs = require("fs");
const path = require("path");
const PDFDocument = require('pdfkit');
/* const pdfjsLib = require('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js'; */

const reportesController =  {

    notaEntrega: async (codigo) => {
        try {
                // Función para dibujar una tabla
                function drawTable(doc, startX, startY, rowHeight, rows, cliente) {
                    const colWidths = [300, 100, 100, 100];
                    const colX = [startX, startX + colWidths[0], startX + colWidths[0] + colWidths[1], startX + colWidths[0] + colWidths[1] + colWidths[2]];
                
                    // Dibujar tabla de datos del cliente
                    doc.fontSize(12).bold().text('Datos del Cliente', startX, startY);
                    const clienteRows = [
                        { etiqueta: 'Nombre', valor: cliente.nombre },
                        { etiqueta: 'Dirección', valor: cliente.direccion },
                        { etiqueta: 'Teléfono', valor: cliente.telefono },
                        { etiqueta: 'Email', valor: cliente.email }
                    ];
                
                    let currentY = startY + rowHeight;
                    clienteRows.forEach(row => {
                        doc.rect(startX, currentY, colWidths[0], rowHeight).stroke();
                        doc.rect(startX + colWidths[0], currentY, colWidths.reduce((a, b) => a + b) - colWidths[0], rowHeight).stroke();
                        doc.fontSize(10).text(row.etiqueta, startX + 5, currentY + 5);
                        doc.text(row.valor, startX + colWidths[0] + 5, currentY + 5);
                        currentY += rowHeight;
                    });
                
                    // Espacio antes de la tabla de productos
                    currentY += rowHeight;
                
                    // Dibujar encabezados de la tabla de productos
                    doc.rect(startX, currentY, colWidths.reduce((a, b) => a + b), rowHeight).stroke();
                    doc.fontSize(12).bold().text('Descripción', colX[0] + 5, currentY + 5);
                    doc.text('Cantidad', colX[1] + 5, currentY + 5);
                    doc.text('Precio', colX[2] + 5, currentY + 5);
                    doc.text('Total', colX[3] + 5, currentY + 5);
                
                    // Dibujar filas de productos
                    currentY += rowHeight;
                    rows.forEach(row => {
                        doc.rect(startX, currentY, colWidths.reduce((a, b) => a + b), rowHeight).stroke();
                        doc.fontSize(10).text(row.descripcion, colX[0] + 5, currentY + 5, { width: colWidths[0] - 10 });
                        doc.text(row.cantidad, colX[1] + 5, currentY + 5);
                        doc.text(row.precio, colX[2] + 5, currentY + 5);
                        doc.text(row.total, colX[3] + 5, currentY + 5);
                        currentY += rowHeight;
                    });
                
                    // Dibujar fila del total
                    const totalY = currentY;
                    doc.rect(startX, totalY, colWidths.reduce((a, b) => a + b), rowHeight).stroke();
                    doc.rect(startX, totalY, colWidths[0], rowHeight).stroke();
                    doc.rect(startX + colWidths[0], totalY, colWidths[1], rowHeight).stroke();
                    doc.rect(startX + colWidths[0] + colWidths[1], totalY, colWidths[2], rowHeight).stroke();
                    doc.rect(startX + colWidths[0] + colWidths[1] + colWidths[2], totalY, colWidths[3], rowHeight).stroke();
                    doc.fontSize(12).bold().text('Total', colX[0] + 5, totalY + 5);
                    doc.text(`${totalFactura}`, colX[3] + 5, totalY + 5);
                
                    return totalY + rowHeight;
                }
        } catch (err) {
            console.error('Error al consultar la base de datos o generar el PDF:', err);
            throw err; // Asegúrate de manejar este error en tu controlador de Express
        }

    },

    /* showNotaEntrega : (req,res,id) => {
        
        const pdfPath = `/reportes/notaEntrega/${id}`;
      
        // Cargar y mostrar el PDF
        pdfjsLib.getDocument(pdfPath).promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
      
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
      
            page.render(renderContext);
            res.render('ventas/prueba', { pdfCanvas: canvas.toDataURL() });
          });
        }).catch((error) => {
          console.error('Error al cargar el PDF:', error);
          res.status(500).send('Error al cargar el PDF');
        });
      },
     */




}
module.exports = reportesController;

