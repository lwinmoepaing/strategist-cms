import mongoose from "mongoose";
import { mongoDbErrorLogger } from "./logger";
import { config } from "dotenv";
import path from "path";

const isTesting = process.env.NODE_ENV === "test";

config({
  path: path.join(__dirname, "../", isTesting ? ".env.test" : ".env"),
});

export const dbConnect = async () => {
  const dbUrl = process.env.DB_URL || "";

  mongoose.connection.on("connected", () => {
    mongoDbErrorLogger.info(`MongoDB Connection : Connected`);
  });

  mongoose.connection.on("disconnected", () => {
    mongoDbErrorLogger.info(`MongoDB Connection : Disconnected`);
  });

  mongoose.connection.on("error", (err) => {
    mongoDbErrorLogger.error(`MongoDB Connection Error: ${err.message}`);
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close(true);
    process.exit(0);
  });

  return mongoose.connect(dbUrl);
};
