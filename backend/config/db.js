import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URL;

const ConnectDB = () => {
    mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
}

export default ConnectDB;