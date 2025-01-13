import { Router } from "express";
import pacientesControllers from "../controllers/pacientes.controllers.js";
const router = Router()

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

router.get('/', pacientesControllers.listarPacientes);

router.get('/general', ensureAuthenticated, preventCache, async (req,res) => {
    try {
        res.render('pacientes/listadoGeneral', {sesion: req.session})
    } catch (error) {
        console.log(`Error en la ruta de listado general de radiografias ${error.message}`)
        res.status(500).send(`Error en la ruta de listado general de radiografias ${error.message}`)
    }
})

router.get('/autocompletePacientes', async (req,res) => {
    try {
        const cedula = req.query.term
        const pacientes = await pacientesControllers.autocompletePacientes(cedula)
        res.json(pacientes);
    } catch (error) {
        console.log(`Error en la ruta de listado general de pacientes ${error.message}`)
        res.status(500).send(`Error en la ruta de listado general de pacientes ${error.message}`)
    }    
})

router.get('/detallesPaciente/:id', async (req,res) => {
    try {
        const id = req.params.id
        const paciente = await pacientesControllers.obtenerPaciente(parseInt(id))
        const {cedula, nombres, apellidos, telefono, direccion} = paciente
        res.render('pacientes/detallesPaciente', {cedula, nombres, apellidos, telefono, direccion})
    } catch (error) {
        console.log(`Error en la ruta de detallesPaciente ${error.message}`)
        res.status(500).send(`Error en la ruta de detallesPaciente ${error.message}`)
    }
})

router.post('/modificarPaciente/:id', async (req,res) => {
    try {
        console.log(req.body)
    } catch (error) {
        console.log(`Error en la ruta de modificarPaciente ${error.message}`)
        res.status(500).send(`Error en la ruta de modificarPaciente ${error.message}`)
    }
})



export default router;