import MONGO_URI from "./url.js";
import connectDB from "./db/connect.js";
// async errors
import "express-async-errors"

import express from "express";
const app = express()

import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

// middleware
app.use(express.json());

// routes

app.get("/", (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

import productsRouter from "./routes/products.js";
app.use("/api/v1/products", productsRouter);

// products route

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = 5000

const start = async () => {
    try {
        //connectDB
        await connectDB(MONGO_URI)
        app.listen(port, () => console.log(`Server is listening port ${port}...`))
    } catch (error) {
        console.log(error)    
    }
}

start()