const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const ventasController = require('../controllers/ventasController');

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

/* router.get('/', preventCache, ensureAuthenticated, async(req, res) => {
  res.render('login');
}); */

router.get('/login', async (req, res) =>{  
    try {
      res.render('login')
    } catch (error) {
      res.render("error", { message: `Error al cargar las categorias: ${error} `});
    }
});

router.post('/validate', async (req, res) => {
  try {
    
    res.send(await authController.auth(req));
    
  } catch (error) {
    res.render("error", { message: `Error al cargar las categorias: ${error} `});
  }
});

router.get('/index', preventCache, ensureAuthenticated,  async (req, res) => {
  /* if (req.session.user) { */
  const porcentajeMeses = await ventasController.comparativaMeses();
  const ventasClientes = await ventasController.obtenerVentasClientes();
  const ventasAnuales = await ventasController.totalAnual();
    res.render('index', {session: req.session, porcentaje: porcentajeMeses, ventas: ventasClientes, ventasAnuales: ventasAnuales})
 /*  } else {
    res.redirect('/auth/404');
  } */
});

router.get('/cerrarSesion', async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/auth/index');
    }
    res.redirect('/auth/login')
  }) 
})

router.get('/404', async (req, res) => {
  res.render('404')
})

router.post('/cambiarContrasena', async (req, res) => {
  console.log(req.body)
  const {codigo, contraseñaNueva} = req.body
  try {
    await authController.cambiarContraseña(codigo, contraseñaNueva);
    res.sendStatus(200);
  } catch (err) {
    console.log('Se ha producido un error en el cambio de contraseña' + err)
  }

})
  
module.exports = router;