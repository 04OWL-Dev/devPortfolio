import { Router } from "express";
import usuariosControllers from "../controllers/usuarios.controllers.js";

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

router.get('/login', async (req,res) => {
    try {
        res.render('auth/login')
    } catch (error) {
        console.log(`Error en la ruta principal de login ${error.message}`)
        res.status(500).send(`Error en la ruta principal de login ${error.message}`)
    }
})

router.post('/validate', async (req,res) => {
 try {
     const { user, password } = req.body;
     const validacion = await usuariosControllers.validarUsuario(user, password);
     if (!validacion) {
         res.status(404).send('Usuario no encontrado')
     } else {
         const {id, nombre, username,password,email, tipo_usuario_id} = validacion
         const sesion = await usuariosControllers.asignarSesion(req, id, nombre, username, password, email, tipo_usuario_id)
         res.status(200).send()
     }     
 } catch (error) {
    console.log(`Error en la ruta de validación del login ${error.message}`)
    res.status(500).send(`Error en la ruta de validación del login ${error.message}`)
 }   
})

router.get('/home', ensureAuthenticated, preventCache, async (req,res) => {
    try {
        const { id, nombre, user, password, email, tipo_usuario } = req.session.user
        res.render('radiografias/listadoGeneral', {id, nombre, user,password,email, tipo_usuario})
    } catch (error) {
        console.log(`Error en la ruta de home ${error.message}`)
        res.status(500).send(`Error en la ruta de home ${error.message}`)
    }
})

router.get('/logout', ensureAuthenticated, preventCache,async (req,res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.log(`Error al cerrar sesión: ${err.message}`);
                return res.status(500).send('Error al cerrar sesión');
            } else {
                // Redirigir a la página de inicio de sesión o a otra página
                res.redirect('/auth/login'); 
            }            
        }); 
    } catch (error) {
        console.log(`Error en la ruta de logout ${error.message}`)
        res.status(500).send(`Error en la ruta de logout ${error.message}`)
    }
})

router.post('/cambiarContrasena', ensureAuthenticated, preventCache, async (req,res) => {
    try {
        const id = req.session.user.id;
        const {contraseñaNueva} = req.body;
        const actualizacion = await usuariosControllers.cambiarContrasena(id, contraseñaNueva);
        res.status(200).send()
    } catch (error) {
        console.log(`Error en la ruta de cambiarContrasena ${error.message}`)
        res.status(500).send(`Error en la ruta de cambiarContrasena ${error.message}`)
    }
})

router.post('/recuperarContrasena', preventCache, async (req,res) => {
    try {
        const { email } = req.body
        const recuperacion = await usuariosControllers.recuperarContrasena(email)
        res.status(200).send()
    } catch (error) {
        if (error.code == 'P2025') {
            res.status(400).json({
                status: error
            })
        } else {
            console.log(`Error en la ruta de recuperarContrasena ${error.message}`)
            res.status(500).send(`Error en la ruta de recuperarContrasena ${error.message}`)
        }        
    }
})

router.get('/404', async (req, res) => {
    res.render('404')
})

export default router;