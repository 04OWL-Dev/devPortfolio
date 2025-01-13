import { Router } from "express";
import path from "path";
import { fileURLToPath } from 'url';
import multer from "multer";
import pacientesControllers from "../controllers/pacientes.controllers.js";
import radiografiasControllers from "../controllers/radiografias.controllers.js";
import imagenesControllers from "../controllers/imagenes.controllers.js";
import crearPDF from "../utils/generarInforme.js";
const router = Router();

// Middleware para evitar el almacenamiento en caché
function preventCache(req, res, next) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
}
  
// Middleware de validación de sesión
function ensureAuthenticated(req, res, next) {
    const ahora = Date.now(); // Obtener el tiempo actual
    const tiempoExpiracion = 15 * 60 * 1000; // Tiempo de expiración de 30 minutos
    if (req.session.user) {
        // Comprobar si la sesión ha expirado
        if (req.session.lastAccess) {
            if (ahora - req.session.lastAccess > tiempoExpiracion) {
                // La sesión ha expirado
                req.session.destroy(); // Destruir la sesión
                return res.redirect('/auth/404'); // Redirigir a la página 404
            }
        }
        // Actualizar el tiempo de último acceso
        req.session.lastAccess = ahora;
        return next();
    } else {
        res.redirect('/auth/404');
    }
}

//Convertir rutas absolutas a relativas
let rutaBase = 'C:\\Users\\Luis Freites\\OneDrive\\Escritorio\\radiologiaApp\\src\\routes\\public'
function rutaRelativa(rutaBase,rutaAbsoluta ) {
    let ruta = path.relative(rutaBase, rutaAbsoluta)
    return `/${ruta.replace(/\\/g,'/')}`
}

router.get('/', ensureAuthenticated, preventCache, async (req,res) => {
    try {
        const listado = await radiografiasControllers.listarRadiografias(req.session.user.tipo_usuario)
        res.json(listado)
    } catch (error) {
        console.log(`Error en la ruta de obtención del JSON de radiografias ${error.message}`)
        res.status(500).send(`Error en la ruta de obtención del JSON de radiografias ${error.message}`)
    }
})

router.get('/general', ensureAuthenticated, preventCache, async (req,res) => {
    try {
        const tipo_usuario = req.session.user.tipo_usuario 
        const nombre = req.session.user.nombre
        res.render('radiografias/listadoGeneral', {tipo_usuario, nombre})
    } catch (error) {
        console.log(`Error en la ruta de listado general de radiografias ${error.message}`)
        res.status(500).send(`Error en la ruta de listado general de radiografias ${error.message}`)
    }
})

router.get('/nuevaRadiografia', ensureAuthenticated, preventCache, async (req, res) => {
    try {
        const { fechaActual, tiposZonas, listaTecnicas } = await radiografiasControllers.datosEncabezado();
        const nombre = req.session.user.nombre
        res.status(200).render('radiografias/guardarRadiografia',{nombre, fechaActual,tiposZonas,listaTecnicas})
    } catch (error) {
        console.log(`Error en la ruta de nuevaRadiografia ${error.message}`)
        res.status(500).send(`Error en la ruta de nuevaRadiografia ${error.message}`)
    }    
})

//Almacenamiento necesario para multer.
const almacenamiento = multer.diskStorage({
    destination: path.join('public/img/radiografias'),
    filename: (req,file,cb) => {
        cb(null, file.originalname);
    }
})
//Inicialización de multer.
const subida = multer({storage: almacenamiento});

router.post('/guardarRadiografia', ensureAuthenticated, preventCache, subida.array('imagen', 3), async (req, res) => {
    try {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        // Convierte las rutas de los archivos subidos en absolutas
        const rutasImagenes = req.files.map(file => path.resolve(__dirname, file.path));
        const nombresImagenes = req.files.map(file => path.basename(file.path));
        const { nombre, apellido, cedula, telefono, direccion, tipo, tecnica, estado, zona, codigoPaciente } = req.body;

        const registroRadiografia = await radiografiasControllers.guardarRadiografia(tipo,codigoPaciente === "null" ? null : parseInt(codigoPaciente),tecnica,estado,zona,cedula,nombre,apellido,telefono,direccion,rutasImagenes, nombresImagenes);
        res.status(200).send('Subida exitosa');
    } catch (error) {
        if (error.code === "P2002") {
            res.status(400).json({
                status: 'error',
                nombre: error.nombre
            });
        } else {
            console.log(`Error en la ruta de guardar nuevaRadiografia ${error.message}`);
            res.status(500).send(`Error en la ruta de guardar nuevaRadiografia ${error.message}`);
        }        
    }
});

router.get('/detallesRadiografia/:id', ensureAuthenticated, preventCache, async (req,res) => {
    try {
        const tipo_usuario = req.session.user.tipo_usuario
        const nombre = req.session.user.nombre
        const id = req.params.id
        const radiografia = await radiografiasControllers.obtenerRadiografia(id)
        const { fecha, tipo_radiografia, zona_radiografia, tecnica_radiografia, paciente, imagenes, observaciones, informe, estado_id } = radiografia
        imagenes.forEach(imagen => {
            imagen.url = rutaRelativa(rutaBase, imagen.url);
        });
        res.render('radiografias/detallesRadiografia', {nombre, fecha, tipo_radiografia, zona_radiografia, tecnica_radiografia, paciente, observaciones, imagenes, tipo_usuario, informe, estado_id})
    } catch (error) {
        console.log(`Error en la ruta de detallesRadiografia ${error.message}`)
        res.status(500).send(`Error en la ruta de detallesRadiografia ${error.message}`)
    }
})

router.get('/modificarRadiografia/:id', ensureAuthenticated, preventCache, async (req,res) => {
    try {
        const id = req.params.id
        const nombre = req.session.user.nombre
        const encabezado = await radiografiasControllers.datosEncabezado();
        const { tiposZonas, listaTecnicas } = encabezado
        const radiografia = await radiografiasControllers.obtenerRadiografia(id)
        const { fecha, tipo_radiografia, zona_radiografia, tecnica_radiografia, paciente, imagenes } = radiografia
        imagenes.forEach(imagen => {
            imagen.url = rutaRelativa(rutaBase, imagen.url);
        });
        res.render('radiografias/modificarRadiografia', {nombre, id,fecha, tipo_radiografia, zona_radiografia, tecnica_radiografia, paciente, imagenes, tiposZonas, listaTecnicas})
    } catch (error) {
        console.log(`Error en la ruta de modificarRadiografia ${error.message}`)
        res.status(500).send(`Error en la ruta de modificarRadiografia ${error.message}`)
    }
})

router.post('/modificarRadiografia/:id', ensureAuthenticated, preventCache, subida.array('imagen', 3), async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const rutasSubidas = req.files.map(file => path.resolve(__dirname, file.path));
        const nombresSubidos = req.files.map(file => path.basename(file.path));
        const { pacienteID, nombre, apellido, cedula, telefono, direccion, tipo, tecnica, estado, zona} = req.body;
        console.log(req.body)

        // Obtén las rutas y nombres de las imágenes existentes
        // Asegura que rutasExistentes y nombresExistentes siempre sean arreglos
        let rutasExistentes = Array.isArray(req.body.imagenesExistentes) ? req.body.imagenesExistentes : [];
        rutasExistentes = rutasExistentes.map(ruta => `${rutaBase}\\${ruta.replace(/\//g, '\\')}`);
        
        let nombresExistentes = Array.isArray(req.body.nombresImagenesExistentes) ? req.body.nombresImagenesExistentes : [];
        nombresExistentes = nombresExistentes.map(nombre => nombre.split('/').pop());

        // Combina las rutas y nombres existentes con los subidos
        const rutasFinales = [...rutasExistentes, ...rutasSubidas];
        const nombresFinales = [...nombresExistentes, ...nombresSubidos];

        console.log(rutasFinales)

        const modificarRadiografia = await radiografiasControllers.modificarRadiografia(id,tipo,pacienteID === "null" ? null : parseInt(pacienteID),tecnica,estado,zona,cedula,nombre,apellido,telefono,direccion,rutasFinales, nombresFinales);
        res.status(200).send('Subida exitosa');
    } catch (error) {
        if (error.code === "P2002") {
            res.status(400).json({
                status: 'error',
                nombre: error.nombre
            });
        } else {
            console.log(`Error en la ruta de guardar nuevaRadiografia ${error.message}`);
            res.status(500).send(`Error en la ruta de guardar nuevaRadiografia ${error.message}`);
        }        
    }
});

router.post('/actualizarEstado/:id', ensureAuthenticated, preventCache, async (req, res) => {
    try {
        console.log('entreeeee')
        const id = req.params.id
        const estado = req.body.estado
        const actualizacion = await radiografiasControllers.actualizarEstado(id, estado)
        res.status(200).send('Actualización Exitosa')
    } catch (error) {
        console.log(`Error en la ruta de actualizarEstado  ${error.message}`);
        res.status(500).send(`Error en la ruta de actualizarEstado ${error.message}`);
    }
})

router.post('/introducirObservacion/:id', ensureAuthenticated, preventCache, async (req, res) => {
    try {
        const id = req.params.id
        const {estado, observaciones} = req.body
        const actualizacion = await radiografiasControllers.introducirObservacion(id, estado, observaciones)
        res.status(200).send('Actualizacion Exitosa')
    } catch (error) {
        console.log(`Error en la ruta de introducirObservacion  ${error.message}`);
        res.status(500).send(`Error en la ruta de introducirObservacion ${error.message}`);
    }
})

router.get('/imprimirPdf/:id', ensureAuthenticated, preventCache, async (req, res) => {
    try {
        
        const id = req.params.id
        const radiografia = await radiografiasControllers.obtenerRadiografia(id)
        const { fecha, tipo_radiografia, zona_radiografia, tecnica_radiografia, paciente, imagenes, observaciones, informe, estado_id } = radiografia
        console.log(radiografia)
        imagenes.forEach(imagen => {
            imagen.url = rutaRelativa(rutaBase, imagen.url);
        });

        const stream = res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${paciente.nombres }${paciente.apellidos}.pdf"` }); 

        crearPDF(
            (data) => stream.write(data),
            () => stream.end(), 
            fecha,
            tipo_radiografia,
            zona_radiografia,
            tecnica_radiografia,
            paciente.nombres,
            paciente.apellidos,
            paciente.cedula,
            imagenes,
            informe.contenido,
            informe.hallazgos
        )
        
    } catch (error) {
        console.log(`Error en la ruta de imprimirPdf  ${error.message}`);
        res.status(500).send(`Error en la ruta de imprimirPdf ${error.message}`);
    }
})
export default router;