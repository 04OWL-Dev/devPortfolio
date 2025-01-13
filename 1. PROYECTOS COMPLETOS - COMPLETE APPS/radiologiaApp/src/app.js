import express from "express";
const app = express();
import session from 'express-session';
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(session({
    secret: 'radiologiaApp',//Para que las sesiones sean distintas.
    resave: false,
    saveUninitialized: false
}))

import rutasRadiografias from "./routes/radiografias.routes.js";
app.use('/radiografias', rutasRadiografias)
import rutasPacientes from "./routes/pacientes.routes.js";
app.use('/pacientes', rutasPacientes)
import rutasAuth from "./routes/auth.routes.js";
app.use('/auth', rutasAuth);
import rutasInformes from "./routes/informes.routes.js";
app.use('/informes', rutasInformes)
export default app;