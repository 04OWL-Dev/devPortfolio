import "express-async-errors"
import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./05-JWT-Basics/starter/.env" });//Esta ruta se toma de acuerdo al posicionamiento del package.json
const app = express();

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

// middleware
app.use(express.static('./05-JWT-Basics/starter/public'));
app.use(express.json());

import mainRouter from "./routes/main.js";
app.use("/api/v1", mainRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



const port = 5000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
