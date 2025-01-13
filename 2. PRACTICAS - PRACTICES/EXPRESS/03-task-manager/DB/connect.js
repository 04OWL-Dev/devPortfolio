import mongoose from "mongoose"

// Exporta una función para conectarte a la base de datos
const connectDB = async (url) => {
    try {
      await mongoose.connect(url);
      console.log('Connected to DB');
    } catch (err) {
      console.error('Error connecting to DB:', err);
      process.exit(1); // Finaliza el proceso si no se puede conectar
    }
  };
  
export default connectDB;
