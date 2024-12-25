import mongoose from "mongoose";
import { config } from "../config/app.config";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);

    console.log("\u2705 Connected to Mongo database");
  } catch (error) {
    console.log("\u26D4 Error connecting to Mongo database");
    process.exit(1);
  }
};

export default connectDatabase;
