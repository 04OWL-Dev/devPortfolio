const express = require('express');
const router = express.Router();
const multer = require("multer");
const clientesController = require('../controllers/clientesController');
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
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/auth/404');
  }
}


router.get('/', clientesController.obtenerClientes2);
router.get('/lista', preventCache, ensureAuthenticated, async (req, res) =>{  
    try {
      res.render('clientes/clientes', {session: req.session})
    } catch (error) {
      res.render("error", { message: `Error al cargar los clientes: ${error} `});
    }
});

router.get("/nuevo", preventCache, ensureAuthenticated, async (req, res) => {
    try {
      res.render("clientes/crearCliente", {session: req.session});
    } catch (error) {
      res.render("error", { message: "Error al cargar el formulario de registro de Clientes" });
    }
});

router.post("/guardar", upload.none(), preventCache, ensureAuthenticated,  async (req, res) => {
  try {
    const datosCliente = req.body;
    const resultado = await clientesController.crearCliente(datosCliente);
    if (resultado.success) {
        res.status(200).json({ message: resultado.message });
    } else {
        res.status(400).json({ message: resultado.message });
    }
} catch (error) {
    console.error('Error en la ruta /guardar:', error); // Log para depuración
    res.status(500).json({ message: 'Error al guardar el cliente', error: error.message });
}
});

router.get("/:codigo/eliminar", preventCache, ensureAuthenticated, async (req, res) => {
  const codigo = req.params.codigo;
  try {
      const cliente = await clientesController.eliminarCliente(codigo);
      res.redirect("/clientes/lista");
  } catch (error) {
      res.render("error", { message: "Error al eliminar el cliente" });
  }
});

router.get("/modificarCliente/:id",  preventCache, ensureAuthenticated, async (req, res) => {
  //CORREGIR
  const id = req.params.id;
  try {
      const cliente = await clientesController.obtenerCliente(id);
      res.render("clientes/edicionCliente", {
          codigo: id,
          nombre: cliente.nombre,
          cedula: cliente.cedula,
          telefono: cliente.telefono, 
        direccion: cliente.direccion,
        session: req.session
      });
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos de la categoría" });
  }
});

router.post("/modificar", upload.none(), preventCache, ensureAuthenticated, async (req, res) => {
  try {
      const resultado = await clientesController.modificarCliente(req.body);
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

router.get("/detallesCliente/:id",  preventCache, ensureAuthenticated, async (req, res) => {
  const id = req.params.id;  
  try {     
    const cliente = await clientesController.obtenerCliente(id);
    
      res.render("clientes/detallesCliente",{cliente : cliente, session: req.session});
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos de la Venta." + error });
  }
});


module.exports = router  

