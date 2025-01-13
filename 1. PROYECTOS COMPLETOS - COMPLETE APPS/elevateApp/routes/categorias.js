const express = require('express');
const router = express.Router();
const multer = require("multer");
const categoriasController = require('../controllers/categoriasController');
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

router.get('/', categoriasController.obtenerCategorias2);
router.get('/lista', preventCache, ensureAuthenticated, async (req, res) =>{  
  try {
    res.render('categorias/categorias',{session: req.session})
  } catch (error) {
    res.render("error", { message: `Error al cargar las categorias: ${error} `});
  }
});


router.get("/nuevo", preventCache, ensureAuthenticated, async (req, res) => {
    try {
      res.render("categorias/crearCategoria", {session: req.session});
    } catch (error) {
      res.render("error", { message: "Error al cargar el formulario de creación de categorías" });
    }
});


router.post("/guardar", upload.none(), preventCache, ensureAuthenticated, async (req, res) => {
    console.log(req.body)
    try{
      const datosCategoria = req.body      
      const resultado = await categoriasController.crearCategoria(datosCategoria);
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
        const categoria = await categoriasController.eliminarCategoria(codigo);
        res.redirect("/categorias/lista");
    } catch (error) {
        res.render("error", { message: "Error al eliminar la categoría" });
    }
});

router.get("/modificarCategoria/:id", preventCache, ensureAuthenticated, async (req, res) => {

    const id = req.params.id;
    try {
        const categoria = await categoriasController.obtenerCategoria(id);
        res.render("categorias/edicionCategoria", {
            id: id,
            nombre: categoria.categoria.nombre,
          descripcion: categoria.categoria.descripcion,
          session: req.session,
        });
    } catch (error) {
      res.render("error", { message: "Error al cargar los datos de la categoría" });
    }
  });
  
  router.post("/modificar", upload.none(), preventCache, ensureAuthenticated, async (req, res) => {

    
    try {
      const resultado = await categoriasController.modificarCategoria(req.body);      
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

  router.get("/detallesCategoria/:id", preventCache, ensureAuthenticated, async (req, res) => {
    const id = req.params.id;  
    try {     
      const categoria = await categoriasController.obtenerCategoria(id);
        res.render("categorias/detallesCategoria",{categoria: categoria.categoria, session: req.session});
    } catch (error) {
      res.render("error", { message: "Error al cargar los datos de la Venta." + error });
    }
  });
  

module.exports = router;


