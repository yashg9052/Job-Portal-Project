import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export async function connectDb() {
  await mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
      console.log("Mongodb connected ");
    })
    .catch((err) => {
       console.log(`Mongodb connection error: ${err}`);
    });
}
