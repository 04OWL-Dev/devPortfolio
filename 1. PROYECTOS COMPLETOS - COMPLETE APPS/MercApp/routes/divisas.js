const express = require('express');
const router = express.Router();
const divisasController = require('../controllers/divisasController');
const { pyDolarVenezuela } = require("consulta-dolar-venezuela");
const categoriasController = require('../controllers/categoriasController');
const pyDolar = new pyDolarVenezuela('bcv');

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

router.get('/', divisasController.consultaGeneral);

router.get('/lista', preventCache, ensureAuthenticated, async (req, res) => {
  try {
    res.render('divisas/divisas', { layout: false, session: req.session }); // Desactiva el layout
  } catch (error) {
    console.log('Error en la ruta de listado de divisas ' + error);
    res.sendStatus(500);
  }
});

router.get('/consultarDivisa', preventCache, ensureAuthenticated, async (req, res) => {
    try {
      const consultaDolar = await divisasController.consultarValor();
      if(!consultaDolar){
        try {
          const {price} = await pyDolar.getMonitor("USD");
          const guardarDivisa = await divisasController.almacenarValor(price);
          res.sendStatus(200);
        } catch (error) {
          console.log('Error al consultar valor de divisa' + error)
          res.sendStatus(500);
        }    
      } else {
        res.sendStatus(200);
      }
    } catch (error) {
      console.log('Error en la ruta de consultarDivisa' + error)
      res.sendStatus(500);
    }  
});

router.post('/almacenarValor', preventCache, ensureAuthenticated, async (req, res) => {
  try {
        const {valor} = req.body
        const insercion = await divisasController.almacenarValor(valor)
        res.sendStatus(200)
    } catch (error) {
        console.log('Error en la ruta de almacenarValor' + error)
        res.sendStatus(500)
    }
})

module.exports = router;