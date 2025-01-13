import express, { json } from 'express'
import connectDB from './DB/connect.js'
import url from './url.js'
import path from 'path'
import { fileURLToPath } from 'url';
const port = 3000
const app = express()
// Configura la carpeta estática
app.use(express.static('./03-task-manager/starter/public'));
app.use(express.json())

import tasksRoutes from './routes/tasks.js'
app.use('/api/v1/tasks', tasksRoutes)

import notFound from './middleware/not-found.js'
app.use(notFound)  

import errorHandlerMiddleware from './middleware/error-handler.js'
app.use(errorHandlerMiddleware)


const startServer = async () => {
    try {
      await connectDB(url); // Asegúrate de que la base de datos esté conectada antes de arrancar el servidor
      app.listen(port, () => console.log(`Server listening on port ${port}`));
    } catch (err) {
      console.error('Error starting server:', err);
    }
};  
startServer();

