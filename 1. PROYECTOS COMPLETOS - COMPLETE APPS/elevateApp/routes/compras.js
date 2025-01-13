const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/comprasController');
const proveedoresController = require('../controllers/proveedoresController');
const productosController = require('../controllers/productosController');

router.get('/', comprasController.obtenerComprasJSON);
router.get("/autoCompleteProveedoresA", comprasController.autoCompleteProveedoresA);
router.get("/autoCompleteProveedoresB", comprasController.autoCompleteProveedoresB);
router.get("/autoCompleteProductosA", comprasController.autoCompleteProductosA);
router.get("/autoCompleteProductosB", comprasController.autoCompleteProductosB);
/* router.post('/guardar', comprasController.registrarCompra);//Debe redireccionar a listado. */

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


router.get('/lista', preventCache, ensureAuthenticated, async (req,res) =>{  
    try {
      res.render('compras/compras', {session: req.session})//
    } catch (error) {
      res.render("error", { message: `Error al cargar las compras: ${error} `});
    }
});

router.get("/nuevo", preventCache, ensureAuthenticated, async (req, res) => {
    try {
      const consulta = await comprasController.crearCompra(); 
          
      const {codigo, proveedores, productos} = consulta;
      res.render('compras/crearCompra', {codigo: codigo, proveedores: proveedores, productos: productos, session: req.session})      
    } catch (error) {
      res.render("error", { message: "Error al cargar el formulario de z de Compras" + error });
    }
});

router.post("/guardar", preventCache, ensureAuthenticated, async (req, res) =>{//Se debe trabajar en la base de datos y la forma en la que se guardará la información. 
  try{
      const datosCompra = req.body
      const compra = await comprasController.crearCompra(datosCompra);
      const registro = await comprasController.registrarCompra(datosCompra);
      res.redirect("/compras/lista");
  }catch (error) {
      res.render("error", { message: "Error al guardar la Compra" });
  }  
});

router.get("/:codigo/eliminar", preventCache, ensureAuthenticated, async (req, res) => {//Se debe tener el listado. 
  const codigo = req.params.codigo;
  try {
      const compra = await comprasController.eliminarCompra(codigo);
      res.redirect("/compras/lista");
  } catch (error) {
      res.render("error", { message: "Error al eliminar la Compra." });
  }
});

router.get("/modificarCompra/:id", preventCache, ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
      const datosCompra = await comprasController.obtenerCompra(id);
      const proveedores = await proveedoresController.obtenerProveedores(); 
      const productos = await productosController.obtenerProductos();
     
      res.render("compras/edicionCompra",{datos:datosCompra, proveedores:proveedores, productos:productos, session: req.session});
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos de la Compra." });
  }
});

router.post("/modificar", preventCache, ensureAuthenticated, async (req, res) => {//Se debe tener la lista. 
  const cuerpo = req.body
  try {
    
    const resultado = await comprasController.modificarCompra(cuerpo);      
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

router.get("/detallesCompra/:id", preventCache, ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
      const datosCompra = await comprasController.obtenerCompra(id);
      const proveedores = await proveedoresController.obtenerProveedores(); 
      const productos = await productosController.obtenerProductos();

      res.render("compras/detallesCompra",{datos:datosCompra, proveedores:proveedores, productos:productos, session: req.session});
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos de la Compra." + error });
  }
});

module.exports = router