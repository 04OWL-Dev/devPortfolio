const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const clientesController = require('../controllers/clientesController');
const productosController = require('../controllers/productosController');
const reportesController = require('../controllers/reportesController');

router.get('/', ventasController.obtenerVentasJSON);
router.get("/autoCompleteClientesA", ventasController.autoCompleteClientesA);
router.get("/autoCompleteClientesB", ventasController.autoCompleteClientesB);
router.get("/autoCompleteProductosA", ventasController.autoCompleteProductosA);
router.get("/autoCompleteProductosB", ventasController.autoCompleteProductosB);
router.get("/totales", ventasController.totales);
router.get("/comparativaMeses", ventasController.comparativaMeses)
/* router.get('/PDF/:id', reportesController.showNotaEntrega); */

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



router.get('/lista',preventCache, ensureAuthenticated, async (req, res) =>{  
  try {
    res.render('ventas/ventas', {session: req.session, user: req.session.user})
  } catch (error) {
    res.render("error", { message: `Error al cargar las compras: ${error} `});
  }
});


router.get("/nuevo", preventCache, ensureAuthenticated, async (req, res) => {
    try {
      const consulta = await ventasController.crearVenta();      
      const { codigo, clientes, productos } = consulta;      
      res.render('ventas/crearVenta', {codigo: codigo,clientes: clientes,productos: productos, session: req.session})      
    } catch (error) {
      res.render("error", { message: "Error al cargar el formulario de creación de Ventas" + error });
    }
});

router.post("/guardar", preventCache, ensureAuthenticated, async (req, res) =>{//Se debe trabajar en la base de datos y la forma en la que se guardará la información. 
  try {
    
      const datosVenta = req.body  
      const nuevaVenta = await ventasController.registrarVenta(datosVenta);
      await reportesController.notaEntrega(datosVenta.codigo);
      res.json({ notaEntrega });

    res.redirect("/ventas/lista");      
  }catch (error) {
      res.render("error", { message: "Error al guardar la Venta" });
  }  
});

router.get("/PDF/:id", preventCache, ensureAuthenticated, async (req, res) =>{//Se debe trabajar en la base de datos y la forma en la que se guardará la información. 
  try {
    const id = req.params.id;
    res.render("ventas/prueba", {showPDF: true,id:id, session: req.session});      
  }catch (error) {
      res.render("error", { message: "Error al guardar la Venta" });
  }  
});


router.get("/detallesVenta/:id", preventCache, ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
      const datosVenta = await ventasController.obtenerVenta(id);
      const clientes = await clientesController.obtenerClientes(); 
      const productos = await productosController.obtenerProductos();

      res.render("ventas/detallesVenta",{datos:datosVenta, clientes:clientes, productos:productos, session: req.session});
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos de la Venta." + error });
  }
});

router.get("/:codigo/eliminar", preventCache, ensureAuthenticated, async (req, res) => {//Se debe tener el listado. 
  const codigo = req.params.codigo;
  try {
      const venta = await ventasController.eliminarVenta(codigo);
      res.redirect("/ventas/lista");
  } catch (error) {
      res.render("error", { message: "Error al eliminar la Compra." });
  }
});

router.get("/modificarVenta/:id", preventCache, ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
      const datosVenta = await ventasController.obtenerVenta(id);
      const clientes = await clientesController.obtenerClientes(); 
      const productos = await productosController.obtenerProductos();      
      res.render("ventas/edicionVenta",{datos:datosVenta, clientes:clientes, productos:productos, session: req.session});
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos de la Compra." + error });
  }
});

router.post("/modificar/:id", preventCache, ensureAuthenticated, async (req, res) => {
  console.log('Entra')
  console.log('Datos recibidos:', req.body);
  console.log('ID recibido:', req.params.id);

  const datosVenta = {
      ...req.body,
      codigo: req.params.id
  };

  try {
      const resultado = await ventasController.modificarVenta(datosVenta);
      if (resultado.success) {
          res.status(200).json({ success: true, message: resultado.message });
      } else {
          res.status(400).json({ success: false, message: resultado.message });
      }
  } catch (error) {
      console.error('Error en la ruta /modificar:', error);
      res.status(500).json({ success: false, message: "Error al modificar la Venta." });
  }
});




module.exports = router;