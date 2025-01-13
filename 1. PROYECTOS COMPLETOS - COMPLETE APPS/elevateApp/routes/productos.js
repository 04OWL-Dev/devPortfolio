
const express = require('express');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const productosController = require('../controllers/productosController');
const categoriasController = require('../controllers/categoriasController');

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

router.get('/', productosController.obtenerProductos1);
router.get('/lista', preventCache, ensureAuthenticated, async (req, res) => {
  try { 
    res.render('productos/productos', {session: req.session});
  } catch (error) {
    res.render("error", { message: `Error al cargar los productos: ${error} `});
  }
});

router.get("/nuevo", preventCache, ensureAuthenticated, async (req, res) => {
  try {
    const categorias = await categoriasController.obtenerCategorias();
    res.render("productos/crearProducto", {categorias:categorias, session: req.session} );
  } catch (error) {
    res.render("error", { message: "Error al cargar el formulario de creación de productos" });
  }
});

const imagenes = "public/img/productos";
const upload = multer({ dest: imagenes });
router.post("/guardar", upload.single("imagen"), preventCache, ensureAuthenticated, async (req, res) => {
  const datosProducto = req.body;
  
  try {
      const resultado = await productosController.crearProducto(datosProducto);

      if (resultado.success) {
          // Manejar la imagen si se ha subido
          if (req.file) {
              const { path } = req.file;  
              const newFilename = `${resultado.codigo}.png`;
              fs.renameSync(path, `public/img/productos/${newFilename}`);
          }
          // Responder con éxito
          res.status(200).json({ message: 'Producto creado exitosamente' });
      } else {
          // Responder con error específico del controlador
          res.status(400).json({ message: resultado.message });
      }
  } catch (error) {
      console.error('Error en la ruta /guardar:', error); // Log para depuración
      res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
  }
});


router.get('/modificar/:codigo', preventCache, ensureAuthenticated, async (req,res) => {

  try{
    const codigo = req.params.codigo;
    const producto = await productosController.obtenerProducto(codigo);
    res.render('productos/edicionProducto', {
      producto: producto.producto,
      categorias: producto.categorias,
      session: req.session
    })  
  }catch (error){
      res.render("error", { message: "Error al agre el producto" + error });
  }
})

router.post("/modificar", upload.single("imagen_producto"), preventCache, ensureAuthenticated, async (req, res) => {
  const codigo = req.body.codigo
  console.log(req.body)
  try {
    
    const producto = await productosController.modificarProducto(req.body);    
    if (req.file) {
      const { originalname, mimetype, size, path } = req.file;  
      const newFilename = `${codigo}.png`;
      fs.renameSync(path, `public/img/productos/${newFilename}`);
      res.redirect("/productos/lista");
    } else {
      res.redirect("/productos/lista");
    }
  } catch (error) {
    res.render("error", { message: "Error al modificar el producto" + error });
  }
});

router.get("/eliminar/:codigo", upload.single("imagen_producto"), preventCache, ensureAuthenticated, async (req, res) => {
  const codigo = req.params.codigo;
  try {
      const producto = await productosController.eliminarProducto(codigo);
      const filename =  `${codigo}.png`
      const filePath = path.join( imagenes, filename);
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(err)
        }    
        fs.unlink(filePath, (err) => {
          if (err) {
           console.log(err)
          }        
        });
      });
      res.redirect("/productos/lista");
  } catch (error) {
      res.render("error", { message: "Error al eliminar el Producto" });
  }
});

router.get("/detallesProducto/:id", preventCache, ensureAuthenticated, async (req, res) => {
  const id = req.params.id;

  try {     
    const producto = await productosController.obtenerProductoDetalle(id);
      res.render("productos/detallesProducto",{producto: producto.producto, session: req.session});
  } catch (error) {
    res.render("error", { message: "Error al cargar los datos de la Venta." + error });
  }
});
module.exports = router;


