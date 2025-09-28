import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@danzacluster.euvut6y.mongodb.net/danzaDB?retryWrites=true&w=majority&appName=DanzaCluster`);
    console.log("✅ MongoDB conectado");
  } catch (error: any) {
    console.error("❌ Error al conectar MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
