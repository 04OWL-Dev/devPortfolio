import PDFDocument from "pdfkit";
import path from "path";
let rutaBase = 'C:\\Users\\Luis Freites\\OneDrive\\Escritorio\\radiologiaApp\\src\\routes\\public'

function crearPDF(dataCallback, endCallback, fecha, tipo_radiografia, zona_radiografia, tecnica_radiografia, nombres, apellidos, cedula, imagenes, informe, hallazgos) {
    const doc = new PDFDocument();
    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    // Logo en la esquina superior derecha
    doc.image('public/img/action.png', 40, 20, { width: 95, height: 95});

    // Título centrado
    doc.fontSize(24);
    doc.text('Informe Radiológico', { align: 'center' });
    doc.moveDown(); // Espacio adicional

    // Datos del paciente
    doc.fontSize(12);
    doc.text(`Fecha: ${fecha}`, 40);
    doc.text(`Paciente: ${nombres} ${apellidos}`);
    doc.text(`Cédula: ${cedula}`);
    doc.text(`Tipo de Radiografía: ${tipo_radiografia.nombre}`);

    if (zona_radiografia && zona_radiografia.nombre) {
        doc.text(`Zona de Radiografía: ${zona_radiografia.nombre}`);
    }
    doc.text(`Técnica de Radiografía: ${tecnica_radiografia.nombre}`);

    // Espacio antes de las imágenes
    doc.moveDown();

    // Imágenes
    const imagenWidth = 230;
    const imagenHeight = 230;
    const marginBetweenImages = 10;

    if (imagenes.length === 1) {
        // Colocar una imagen centrada
        const x = (doc.page.width - imagenWidth) / 2;
        doc.image('public' + imagenes[0].url, x, doc.y, { width: imagenWidth, height: imagenHeight });
        doc.moveDown(marginBetweenImages + 8); // Espacio después de la imagen

        // Texto debajo de la imagen
        doc.moveDown(); // Espacio adicional antes de las conclusiones
        doc.fontSize(12);
        doc.text('Conclusiones:', { align: 'left' });
        doc.moveDown(0.5);
        doc.text(`${informe}`, { align: 'justify' });

        doc.moveDown();
        doc.text('Hallazgos:', { align: 'left' });
        doc.moveDown(0.5);
        doc.text(`${hallazgos}`, { align: 'justify' });

        // Firma al final de la página
        doc.moveDown(6);
        const firmaX = (doc.page.width - 100) / 2;
        doc.moveTo(firmaX, doc.y).lineTo(firmaX + 100, doc.y).stroke();
        doc.text('Firma', firmaX + 30, doc.y + 10);

    } else if (imagenes.length === 2) {
        // Colocar dos imágenes en la primera página
        let imageY = doc.y;
        for (let i = 0; i < 2; i++) {
            const x = (doc.page.width - imagenWidth) / 2;
            doc.image('public' + imagenes[i].url, x, imageY, { width: imagenWidth, height: imagenHeight });
            imageY += imagenHeight + marginBetweenImages;
        }

        // Forzar salto de página antes del texto
        doc.addPage();

        // Texto en la segunda página
        doc.fontSize(12);
        doc.text('Conclusiones:', { align: 'left' });
        doc.moveDown(0.5);
        doc.text(`${informe}`, { align: 'justify' });

        doc.moveDown();
        doc.text('Hallazgos:', { align: 'left' });
        doc.moveDown(0.5);
        doc.text(`${hallazgos}`, { align: 'justify' });

        // Firma al final de la segunda página
        doc.moveDown(6);
        const firmaX = (doc.page.width - 100) / 2;
        doc.moveTo(firmaX, doc.y).lineTo(firmaX + 100, doc.y).stroke();
        doc.text('Firma', firmaX + 30, doc.y + 10);

    } else if (imagenes.length === 3) {
        // Colocar las dos primeras imágenes en la primera página
        let imageY = doc.y;
        for (let i = 0; i < 2; i++) {
            const x = (doc.page.width - imagenWidth) / 2;
            doc.image('public' + imagenes[i].url, x, imageY, { width: imagenWidth, height: imagenHeight });
            imageY += imagenHeight + marginBetweenImages;
        }

        // Saltar a la segunda página para la tercera imagen
        doc.addPage();
        const x = (doc.page.width - imagenWidth) / 2;
        doc.image('public' + imagenes[2].url, x, doc.y, { width: imagenWidth, height: imagenHeight });
        doc.moveDown(marginBetweenImages + 8);

        // Texto debajo de la tercera imagen
        doc.moveDown();
        doc.fontSize(12);
        doc.text('Conclusiones:', { align: 'left' });
        doc.moveDown(0.5);
        doc.text(`${informe}`, { align: 'justify' });

        doc.moveDown();
        doc.text('Hallazgos:', { align: 'left' });
        doc.moveDown(0.5);
        doc.text(`${hallazgos}`, { align: 'justify' });

        // Firma al final de la segunda página
        doc.moveDown(6);
        const firmaX = (doc.page.width - 100) / 2;
        doc.moveTo(firmaX, doc.y).lineTo(firmaX + 100, doc.y).stroke();
        doc.text('Firma', firmaX + 30, doc.y + 10);
    }

    doc.end();
}








export default crearPDF