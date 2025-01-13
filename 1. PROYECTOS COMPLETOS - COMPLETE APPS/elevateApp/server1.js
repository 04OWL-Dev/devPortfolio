const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const db = require("./config/database");

app.get("/", async (req, res) => {
  try {
    const products = await db.query("SELECT * FROM productos");
    const usos = await db.query("SELECT * FROM usos");
    const categorias = await db.query("SELECT * FROM categorias");
    res.render("index",{
      products: products.rows,
      usos: usos.rows,
      categorias: categorias.rows,
    });
  } catch (error) {
    res.render("error", { message: "Error al cargar los productos" });
  }
});

app.get("/categorias", async (req, res) => {
  //Información de la tabla en la bd y Envia la lista.
  try {
    const categorias = await db.query(
      "SELECT * FROM categorias ORDER BY codigo asc"
    );
    res.render("categorias", { categorias: categorias.rows });
  } catch (error) {
    res.render("error", { message: "Error al cargar las categorías" });
  }
});

app.get("/categorias/nuevaCategoria", async (req, res) => {
  //Muestra el crear nueva categoria.
  try {
    res.render("crearCategoria");
  } catch (error) {
    res.render("error", { message: "Error al cargar las categorías" });
  }
});

app.post("/categorias/nuevo", async (req, res) => {
  //Inserta categorias a la tabla y redirecciona al listado de las categorias.
  console.log(req.body);
  const { nombre, descripcion } = req.body;
  try {
    await db.query(
      `INSERT INTO categorias(nombre, descripcion, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ($1, $2, current_timestamp,NULL, 1)`,
      [nombre, descripcion]
    );
    res.redirect("/categorias");
  } catch (error) {
    res.render("error", { message: "Error al agregar el producto" });
  }
});

app.get("/categorias/:id/modificarCategoria", async (req, res) => {
  //Recibe el Id de la categoria a modificar y se envia al formulario de modificar.
  console.log(req.params.id);
  try {
    const categoria = await db.query(
      `SELECT * FROM categorias WHERE codigo = ${req.params.id}`
    );

    console.log(categoria.rows[0].nombre, categoria.rows[0].descripcion);
    res.render("edicionCategoria", {
      id: req.params.id,
      nombre: categoria.rows[0].nombre,
      descripcion: categoria.rows[0].descripcion,
    });
  } catch (error) {
    res.render("error", { message: "Error al agregar el producto" });
  }
});

app.post("/categorias/modificar", async (req, res) => {
  //Modifica categorias.
  const { id, nombre, descripcion } = req.body;
  try {
    await db.query(
      `UPDATE categorias SET nombre= '${nombre}', descripcion='${descripcion}', fecha_modificacion= current_timestamp WHERE codigo= '${id}'`
    );
    res.redirect("/categorias");
  } catch (error) {
    res.render("error", { message: "Error al agregar el producto" });
  }
});

app.get("/categorias/:codigo/eliminar", async (req, res) => {
  //Elimina categoria.
  const codigo = req.params.codigo;
  try {
    await db.query(`DELETE FROM public.categorias WHERE codigo = ${codigo}`);
    res.redirect("/categorias");
  } catch (error) {
    res.render("error", { message: "Error al agregar el producto" });
  }
});

app.post("/productos", async (req, res) => {
  console.log(req.body);
  const {
    codigob,
    nombre,
    marca,
    codigo_uso,
    codigo_categoria,
    minimo,
    precio_compra,
    precio_venta,
  } = req.body;
  try {
    await db.query(
      "INSERT INTO productos(codigob, nombre, marca, codigo_uso, codigo_categoria, minimo, precio_compra, precio_venta) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);",
      [
        codigob,
        nombre,
        marca,
        codigo_uso,
        codigo_categoria,
        minimo,
        precio_compra,
        precio_venta,
      ]
    );
    //res.redirect('/');
  } catch (error) {
    res.render("error", { message: "Error al agregar el producto" });
  }
});

app.get("/proveedores", async (req, res) => {
  // Rellena la lista de proveedores desde la tabla de la bd.
  try {
    const proveedores = await db.query(
      "SELECT * FROM proveedores ORDER BY codigo asc"
    );
    res.render("proveedores", { proveedores: proveedores.rows });
  } catch (error) {
    res.render("error", { message: "Error al cargar el proveedor." });
  }
});

app.get("/proveedores/nuevoProveedor", async (req, res) => {
  //Muestra el formulario de crear nuevo proveedor.
  try {
    const bancos = await db.query("SELECT * FROM bancos");
    res.render("crearProveedor", { bancos: bancos.rows });
  } catch (error) {
    res.render("error", { message: "Error al cargar las categorías" });
  }
});

app.post("/proveedores/nuevo", async (req, res) => {
  //Inserta proveedores a la tabla de bd y redirecciona a la lista.
  const { rif, razonsocial, direccion, web, email, banco, cuenta, telefono } =
    req.body;

  try {
    await db.query(
      `INSERT INTO proveedores (rif, razon_social, direccion, web, correo, banco, numerocuenta, telefono, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${rif}', '${razonsocial}', '${direccion}', '${web}', '${email}', '${banco}', '${cuenta}', '${telefono}', current_timestamp,NULL, 1)`
    );
    res.redirect("/proveedores/nuevoProveedor");
  } catch (error) {
    res.render("error", { message: "Error al agregar el proveedor" });
  }
});

app.get("/proveedores/:codigo/eliminarProveedor", async (req, res) => {
  //Elimina proveedor.
  const codigo = req.params.codigo;
  try {
    await db.query(`DELETE FROM public.proveedores WHERE codigo = ${codigo}`);
    res.redirect("/proveedores");
  } catch (error) {
    res.render("error", { message: "Error al eliminar el proveedor" });
  }
});

app.get("/proveedores/:id/modificarProveedor", async (req, res) => {
  //Recibe el Id del proveedor a modificar y se envia al formulario de modificar.
  console.log(req.params.id);
  try {
    const proveedor = await db.query(
      `SELECT * FROM proveedores WHERE codigo = ${req.params.id}`
    );
    const bancos = await db.query(`SELECT * FROM bancos`);
    res.render("edicionProveedor", {
      proveedor: proveedor.rows[0],
      bancos: bancos.rows,
    });
  } catch (error) {
    res.render("error", { message: "Error al cargar formulario" });
  }
});

app.post("/proveedores/modificar", async (req, res) => {
  //Modifica proveedor.
  const {id, rif, razonsocial, direccion, web, email, banco, cuenta, telefono} = req.body;

  try {
    await db.query(
      `UPDATE proveedores SET rif= '${rif}', razon_social='${razonsocial}', direccion='${direccion}', web='${web}', correo='${email}', banco='${banco}', numerocuenta='${cuenta}', telefono='${telefono}', fecha_modificacion= current_timestamp WHERE codigo= '${id}'`
    );
    res.redirect("/proveedores");
  } catch (error) {
    res.render("error", { message: "Error al modificar" });
  }
});

// Clientes

app.get("/clientes", async (req, res) => {
  // Rellena la lista de clientes desde la tabla de la bd.
  try {
    const clientes = await db.query(
      "SELECT * FROM clientes ORDER BY codigo asc"
    );
    console.log(clientes.rows);
    res.render("clientes", { clientes: clientes.rows });
  } catch (error) {
    res.render("error", { message: "Error al cargar el proveedor." });
  }
});

app.get("/clientes/nuevoCliente", async (req, res) => {
  //Muestra el crear nuevo cliente.
  try {
    res.render("crearCliente");
  } catch (error) {
    res.render("error", { message: "Error al cargar las categorías" });
  }
});

app.post("/clientes/nuevo", async (req, res) => {
  //Inserta proveedores a la tabla de bd y redirecciona a la lista.
  console.log(req.body);
  const { cedula, nombre, direccion, telefono } = req.body;
  try {
    await db.query(
      `INSERT INTO clientes (cedula, nombre, direccion, telefono, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${cedula}', '${nombre}', '${direccion}', '${telefono}', current_timestamp,NULL, 1)`
    );
    res.redirect("/clientes");
  } catch (error) {
    res.render("error", { message: "Error al agregar el proveedor" });
  }
});

app.get("/clientes/eliminarCliente/:codigo", async (req, res) => {
  //Elimina cliente.
  const codigo = req.params.codigo;
  try {
    await db.query(`DELETE FROM public.clientes WHERE codigo = ${codigo}`);
    res.redirect("/clientes");
  } catch (error) {
    res.render("error", { message: "Error al eliminar el proveedor" });
  }
});

app.get("/clientes/:codigo/modificarCliente", async (req, res) => {
  //Recibe el Id del cliente a modificar y se envia al formulario de modificar.
  try {
    const cliente = await db.query(
      `SELECT * FROM clientes WHERE codigo = ${req.params.codigo}`
    );
    res.render("edicionCliente", {
      cliente: cliente.rows[0],
    });
  } catch (error) {
    res.render("error", { message: "Error al cargar formulario" });
  }
});

app.post("/clientes/modificar", async (req, res) => {
  //Modifica proveedor.
  const { codigo, cedula, nombre, direccion, telefono } = req.body;
  try {
    await db.query(
      `UPDATE clientes SET cedula= '${cedula}', nombre='${nombre}', direccion='${direccion}',telefono='${telefono}', fecha_modificacion= current_timestamp WHERE codigo= '${codigo}'`
    );
    res.redirect("/clientes");
  } catch (error) {
    res.render("error", { message: "Error al modificar" });
  }
});

//Productos

app.get("/productos", async (req, res) => {
  // Rellena la lista de productos desde la tabla de la bd.
  try {
    const productos = await db.query(
      "SELECT * FROM productos ORDER BY codigo asc"
    );

    res.render("productos", { productos: productos.rows });
  } catch (error) {
    res.render("error", { message: "Error al cargar el proveedor." });
  }
});

app.get("/productos/nuevoProducto", async (req, res) => {
  //Muestra el crear nuevo producto.
  try {
    res.render("crearProducto");
  } catch (error) {
    res.render("error", { message: "Error al cargar las categorías" });
  }
});

function obtenerCodigoProducto(callback) {
  const query = "SELECT codigo FROM productos LIMIT 1"; // Cambia "productos" por el nombre de tu tabla de productos
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener el código del producto:", err);
      callback(err, null);
      return;
    }

    if (results.length === 0) {
      console.error("No se encontraron productos");
      callback(new Error("No se encontraron productos"), null);
      return;
    }

    const codigo = results.codigo;
    callback(null, codigo);
  });
}

const upload = multer({ dest: "public/img/productos" });

app.post(
  "/productos/nuevo",
  upload.single("imagen_producto"),
  async (req, res) => {
    //Inserta productos a la tabla de bd y redirecciona a la lista.
    console.log(req.body);
    const {
      codigo_barras,
      nombre,
      marca,
      modelo,
      uso,
      categoria,
      existencias,
      minimo,
      pcompra,
      pventa,
    } = req.body;
    try {
      const sent = await db.query(
        `INSERT INTO productos (codigo_barras, nombre, marca, modelo, uso, categoria, existencias, minimo, precio_compra, precio_venta, estatus, fecha_creacion, fecha_modificacion, usuario_modificador) VALUES ('${codigo_barras}', '${nombre}', '${marca}', '${modelo}', '${uso}', '${categoria}', '${existencias}', '${minimo}', '${pcompra}', '${pventa}', 'true', current_timestamp,NULL, 1) RETURNING codigo`
      );

      const { codigo } = sent.rows[0];
      const { originalname, mimetype, size, path } = req.file;
      const extension = originalname.split(".").pop();
      const newFilename = `${codigo}.png`;
      fs.renameSync(path, `public/img/productos/${newFilename}`);

      res.redirect("/productos");
    } catch (error) {
      res.render("error", { message: "Error al agregar el producto" });
    }
  }
);

app.get("/productos/:codigo/eliminarProducto", async (req, res) => {
  //Elimina producto
  const codigo = req.params.codigo;
  try {
    await db.query(`DELETE FROM public.productos WHERE codigo = ${codigo}`);
    res.redirect("/productos");
  } catch (error) {
    res.render("error", { message: "Error al eliminar el producto" });
  }
});

app.get("/productos/:codigo/modificarProducto", async (req, res) => {
  //Recibe el Id del producto a modificar y se envia al formulario de modificar.
  try {
    const producto = await db.query(
      `SELECT * FROM productos WHERE codigo = ${req.params.codigo}`
    );
    res.render("edicionProducto", {
      producto: producto.rows[0],
    });
  } catch (error) {
    res.render("error", { message: "Error al cargar formulario" });
  }
});

app.post(
  "/productos/modificar",
  upload.single("imagen_producto"),
  async (req, res) => {
    //Modifica producto.
    const {
      codigo,
      codigo_barras,
      nombre,
      marca,
      modelo,
      uso,
      categoria,
      existencias,
      minimo,
      pcompra,
      pventa,
    } = req.body;

    try {

      await db.query(
        `UPDATE productos SET codigo_barras= '${codigo_barras}', nombre='${nombre}', marca='${marca}', modelo='${modelo}', uso='${uso}', categoria='${categoria}', existencias= '${existencias}', minimo= '${minimo}', precio_compra= '${pcompra}', precio_venta= '${pventa}',fecha_modificacion= current_timestamp WHERE codigo= '${codigo}'`
      );

      const { originalname, mimetype, size, path } = req.file;
      const extension = originalname.split(".").pop();
      const newFilename = `${codigo}.png`;
      fs.renameSync(path, `public/img/productos/${newFilename}`);

      res.redirect("/productos");
    } catch (error) {
      console.log(error);
      res.render("error", { message: "Error al modificar" });
    }
  }
);

//Compras

app.get("/compras/nuevaCompra", async (req, res) => { 

  try {
    const codigo = await db.query('SELECT codigo_ecompra FROM detalles_compra ORDER BY codigo_ecompra DESC LIMIT 1')
    const codigoActual = codigo.rows[0].codigo_ecompra
    const codigoNuevo = codigoActual + 1;  

    const formas_pago = await db.query(
      "SELECT * FROM formas_pago ORDER BY codigo asc"
    );

    const proveedores = await db.query(
      "SELECT * FROM proveedores ORDER BY codigo asc"
    );

    const productos = await db.query(
      "SELECT * FROM productos ORDER BY codigo asc"
    );

    res.render("crearCompra", {codigo : codigoNuevo, productos: productos.rows, proveedores: proveedores.rows, formas_pago: formas_pago.rows});
  } catch (error) {
    res.render("error", { message: "Error al cargar el formulario" });
  }

});

app.post("/compras/nuevaCompra", async (req, res) => {
  //Muestra el crear nueva compra.

  const {
    codigo,
    codigo_proveedor,
    codigo_forma_pago,
    fecha_compra,
    codigo_producto,
    precio,
    cantidad,
    total_producto,
    total_compra,
  } = req.body;

  try {
    res.render("crearCompra");
  } catch (error) {
    res.render("error", { message: "Error al cargar el formulario" });
  }
});

/* app.get("/proveedor/autoComplete", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM proveedores ORDER BY codigo asc"
    );
    console.log(rows);
  } catch (error) {
    console.log(error);
  }

  foreach ($productos as $row) {
      $data['id'] = $row['id'];
      $data['value'] = $row['nombre'];
      $data['label'] = $row['nombre'];
      array_push($returnData, $data);
  }
  echo json_encode($returnData);
}); */

app.get("/proveedores/autoComplete", async (req, res) => {
  const term = req.query.term.toLowerCase();

  let query = `SELECT  codigo,razon_social FROM proveedores WHERE  `;
  if (Number.isInteger(term)) {
    query += ` codigo = ${term} or `;
  }
  query += ` LOWER (razon_social) like '%${term}%' or LOWER (rif) like '%${term}%' ORDER BY razon_social asc`;
  console.log(query);
  const proveedores = await db.query(query);

  console.log(proveedores.rows);
  /* const results = rows
    .filter((proveedor) => proveedor.nombre.toLowerCase().includes(term))
    .map((proveedor) => proveedor.nombre); */

  res.json(proveedores.rows);
});

app.get("/proveedores/autoCompleteb", async (req, res) => {
  const codigo = req.query.codigo; // Usar 'codigo' en lugar de 'term'

    let query = `SELECT codigo, razon_social FROM proveedores WHERE codigo = $1 ORDER BY razon_social ASC`;
    const values = [codigo];

    try {
        const proveedores = await db.query(query, values);
        res.json(proveedores.rows);
    } catch (error) {
        console.error('Error ejecutando la consulta:', error);
        res.status(500).send('Error en el servidor');
    }
});


app.get("/productos/autoComplete", async (req, res) => {
  const term = req.query.term.toLowerCase();

  let query = `SELECT  codigo,nombre,precio_compra FROM productos WHERE  `;
  if (Number.isInteger(term)) {
    query += ` codigo = ${term} or `;
  }
  query += ` LOWER (nombre) like '%${term}%' ORDER BY nombre asc`;
  console.log(query);
  const productos = await db.query(query);

  console.log(productos.rows);
  /* const results = rows
    .filter((proveedor) => proveedor.nombre.toLowerCase().includes(term))
    .map((proveedor) => proveedor.nombre); */

  res.json(productos.rows);
});

app.get("/productos/autoCompleteb", async (req, res) => {
  const codigo = req.query.codigo; // Usar 'codigo' en lugar de 'term'

    let query = `SELECT codigo, nombre, precio_compra FROM productos WHERE codigo = $1 ORDER BY nombre ASC`;
    const values = [codigo];

    try {
        const productos = await db.query(query, values);
        res.json(productos.rows);
    } catch (error) {
        console.error('Error ejecutando la consulta:', error);
        res.status(500).send('Error en el servidor');
    }
});



app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
