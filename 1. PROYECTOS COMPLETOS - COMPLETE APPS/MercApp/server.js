const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const session = require('express-session');
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias')
const clientesRoutes = require('./routes/clientes');
const proveedoresRoutes = require('./routes/proveedores');
const comprasRoutes = require('./routes/compras');
const ventasRoutes = require('./routes/ventas');
const reportesRoutes = require('./routes/reportes');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');
const divisasRoutes = require('./routes/divisas');
const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
// Configuración de la sesión
app.use(session({
  secret: 'tu_secreto', // Cambia esto por una cadena secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));



// Configuración de las rutas
app.use('/productos', productosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/clientes', clientesRoutes);
app.use('/proveedores', proveedoresRoutes);
app.use('/compras', comprasRoutes);
app.use('/ventas', ventasRoutes);
app.use('/reportes', reportesRoutes);
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/divisas', divisasRoutes);


module.exports = app

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
