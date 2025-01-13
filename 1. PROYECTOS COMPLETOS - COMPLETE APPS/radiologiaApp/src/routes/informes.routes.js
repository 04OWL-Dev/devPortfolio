import { Router } from "express";
const router = Router();
import path from "path";
import radiografiasControllers from "../controllers/radiografias.controllers.js";
import multer from "multer";
const upload = multer()

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

let rutaBase = 'C:\\Users\\Luis Freites\\OneDrive\\Escritorio\\radiologiaApp\\src\\routes\\public'
function rutaRelativa(rutaBase,rutaAbsoluta ) {
    let ruta = path.relative(rutaBase, rutaAbsoluta)
    return `/${ruta.replace(/\\/g,'/')}`
}

router.get('/generarInforme/:id', ensureAuthenticated, preventCache, async (req,res) => {
    try {
        const tipo_usuario = req.session.user.tipo_usuario
        const nombre = req.session.user.nombre
        const id = req.params.id
        const radiografia = await radiografiasControllers.obtenerRadiografia(id)
        const { fecha, tipo_radiografia, zona_radiografia, tecnica_radiografia, paciente,imagenes, informe, hallazgos, estado_id} = radiografia
        imagenes.forEach(imagen => {
            imagen.url = rutaRelativa(rutaBase, imagen.url);
        });
        res.render('informes/generarInforme', {id, nombre, fecha, tipo_radiografia, zona_radiografia, tecnica_radiografia, paciente, imagenes, informe, hallazgos, estado_id, tipo_usuario})        
    } catch (error) {
        console.log(`Error en la ruta de generarInforme ${error.message}`)
        res.status(500).send(`Error en la ruta de generarInforme ${error.message}`)
    }
})

router.post('/guardarInforme/:id', ensureAuthenticated, preventCache, upload.none(), async (req,res) => {
    try {
        const { id, estado, informe, hallazgos, observaciones } = req.body
        const insercion = await radiografiasControllers.introducirInforme(id, estado, informe, hallazgos, observaciones)
        res.status(200).send('Subida exitosa');
    } catch (error) {
        console.log(`Error en la ruta de guardarInforme ${error.message}`)
        res.status(500).send(`Error en la ruta de guardarInforme ${error.message}`)
    }
})


export default router;