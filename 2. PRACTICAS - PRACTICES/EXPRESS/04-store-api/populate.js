import MONGO_URI from "./url.js";
import connectDB from "./db/connect.js";
import Product from "./models/product.js";
import products from "./products.json" assert { type: 'json' };;

const start = async () => {
    try {
        await connectDB(MONGO_URI);
        await Product.deleteMany()
        await Product.create(products);
        console.log("Success!!!!");
        process.exit(0);//Termina el proceso sin errores
    } catch (error) {
        console.log(error);
        process.exit(1);//Termina el proceso con errores
    }
};

start()
