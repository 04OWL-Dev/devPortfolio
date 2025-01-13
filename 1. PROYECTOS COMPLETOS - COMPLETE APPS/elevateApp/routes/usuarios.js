const express = require('express');
const router = express.Router();
const multer = require("multer");
const usuariosController = require('../controllers/usuariosController');
const rolesController = require('../controllers/rolesController');
const upload = multer();

// Middleware para evitar el almacenamiento en caché
function preventCache(req, res, next) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
}

// Middleware de validación de sesión
function ensureAuthenticated(req, res, next) {
  console.log(req.session)
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/auth/404');
  }
}

router.get('/', usuariosController.obtenerUsuarios2);
router.get('/lista', preventCache, ensureAuthenticated, async (req, res) =>{  
    try {
      res.render('usuarios/usuarios', {session: req.session})
    } catch (error) {
      res.render("error", { message: `Error al cargar los clientes: ${error} `});
    }
});

router.get("/nuevo", preventCache, ensureAuthenticated, async (req, res) => {
    try {
        const roles = await rolesController.obtenerRoles();  
        console.log(roles)
      res.render("usuarios/crearUsuario", {roles: roles, session: req.session});
    } catch (error) {
      res.render("error", { message: "Error al cargar el formulario de registro de Clientes" });
    }
});

router.post("/guardar", upload.none(), preventCache, ensureAuthenticated, async (req, res) => {
  try{
      const datosUsuario = req.body
      const resultado = await usuariosController.crearUsuario(datosUsuario);
      if (resultado.success) {
        res.status(200).json({ message: resultado.message });
      } else {
          res.status(400).json({ message: resultado.message });
      }
  }catch (error) {
    console.error('Error en la ruta /guardar:', error); // Log para depuración
    res.status(500).json({ message: 'Error al guardar el cliente', error: error.message });
  }  
});

router.get("/:codigo/eliminar", preventCache, ensureAuthenticated, async (req, res) => {
  const codigo = req.params.codigo;
  try {
      const usuario = await usuariosController.eliminarUsuario(codigo);
      res.redirect("/usuarios/lista");
  } catch (error) {
      res.render("error", { message: "Error al eliminar el cliente" });
  }
});

router.get("/modificarUsuario/:id", preventCache, ensureAuthenticated, async (req, res) => {
  //CORREGIR
  const id = req.params.id;
  try {
      const usuario = await usuariosController.obtenerUsuario(id);
      const roles = await rolesController.obtenerRoles(); 
      console.log(usuario);
    res.render("usuarios/edicionUsuario", {
          username: usuario[0].username,
          password: usuario[0].password, 
          codigo_rol: usuario[1].codigo, 
          nombre_rol: usuario[1].nombre_rol,
          roles: roles, 
          id: id, 
          session: req.session,
      })//Mejorar
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos del Usuario" });
  }
});

router.post("/modificar", upload.none(), preventCache, ensureAuthenticated, async (req, res) => {
  try {
    const resultado = await usuariosController.modificarUsuario(req.body);      
    if (resultado.success) {
      res.status(200).json({ success: true, message: resultado.message });
  } else {
      res.status(400).json({ success: false, message: resultado.message });
  }
  } catch (error) {
      console.error('Error en la ruta /modificar:', error); // Log para depuración
      res.status(500).json({ success: false, message: 'No se realizaron cambios, intente nuevamente', error: error.message });
  }
});

router.get("/detallesUsuario/:id", preventCache, ensureAuthenticated, async (req, res) => {
  const id = req.params.id;  
  try {     
    const usuario = await usuariosController.obtenerUsuario(id);
    
    res.render("usuarios/detallesUsuario",{username : usuario[0].username, password: usuario[0].password, rol: usuario[1].nombre_rol, session: req.session});
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos de la Venta." + error });
  }
});


module.exports = router  

