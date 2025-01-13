const express = require('express');
const router = express.Router();
const multer = require("multer");
const proveedoresController = require('../controllers/proveedoresController');
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


router.get('/', proveedoresController.obtenerProveedores2);
router.get('/lista', preventCache, ensureAuthenticated, async (req, res) =>{  
    try {
      res.render('proveedores/proveedores', {session: req.session})
    } catch (error) {
      res.render("error", { message: `Error al cargar los proveedores: ${error} `});
    }
});

router.get("/nuevo", preventCache, ensureAuthenticated, async (req, res) => {
    try {
      const bancos = await proveedoresController.obtenerBancos();
      console.log(bancos.rows)
      res.render('proveedores/crearProveedor', {bancos : bancos.rows, session: req.session})
      
    } catch (error) {
      res.render("error", { message: "Error al cargar el formulario de registro de Proveedor" });
    }
});

router.post("/guardar", upload.none(), preventCache, ensureAuthenticated, async (req, res) => {
  try{
      const datosProveedor = req.body
      const resultado = await proveedoresController.crearProveedor(datosProveedor);
      if (resultado.success) {
        res.status(200).json({ message: resultado.message });
    } else {
        res.status(400).json({ message: resultado.message });
    }
  }catch (error) {
    console.error('Error en la ruta /guardar:', error); // Log para depuración
    res.status(500).json({ message: 'Error al guardar el proveedor', error: error.message });
  }  
});

router.get("/:codigo/eliminar", preventCache, ensureAuthenticated, async (req, res) => {
  const codigo = req.params.codigo;
  try {
      const proveedor = await proveedoresController.eliminarProveedor(codigo);
      res.redirect("/proveedores/lista");
  } catch (error) {
      res.render("error", { message: "Error al eliminar el Proveedor" });
  }
});

router.get("/modificarProveedor/:id", preventCache, ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
      const consulta = await proveedoresController.obtenerProveedor(id);
      const proveedor = consulta[0].rows
      const bancos = consulta[1].rows   
      res.render("proveedores/edicionProveedor",{proveedor : proveedor[0],bancos,session: req.session});
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos del proveedor" });
  }
});

router.post("/modificar", upload.none(), preventCache, ensureAuthenticated, async (req, res) => {
  try {
    // Llamada al controlador para modificar el proveedor
    const resultado = await proveedoresController.modificarProveedor(req.body);
    
    // Enviar una respuesta basada en el resultado del controlador
    if (resultado.success) {
      res.status(200).json({ message: resultado.message });
    } else {
      res.status(400).json({ message: resultado.message });
    }
  } catch (error) {
    console.error('Error en la ruta /modificar:', error); // Log para depuración
    res.status(500).json({ message: 'Error al modificar el proveedor', error: error.message });
  }
});

router.get("/detallesProveedor/:id", preventCache, ensureAuthenticated, async (req, res) => {
  const id = req.params.id;  
  try {     
    const consulta = await proveedoresController.obtenerProveedor(id);
    const proveedor = consulta[0].rows
    console.log(proveedor)
      res.render("proveedores/detallesProveedor",{proveedor : proveedor[0], session: req.session});
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos de la Venta." + error });
  }
});

module.exports = router 