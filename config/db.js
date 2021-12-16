/*
 * All steps related to connecting to database
 */

import mongoose from "mongoose";
import logMessage from "../helper/logMessage.js";
import { MONGODB_URI } from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logMessage("Bot is now ready");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
