import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { initFileRouter } from "node-file-router";
import path from "path";
import { generalLogger, requestLogger } from "./lib/logger";
import { successResponse } from "./util/response";
import { dbConnect } from "./lib/dbConnect";

const startServer = async () => {
  const app = express();
  // Dotenv configuration
  config({
    path: path.join(__dirname, ".env"),
  });

  const port = process.env.SERVER_PORT || 3000;

  /**
   * =======================
   * Connect Database
   * =======================
   */
  dbConnect();

  /**
   * =======================
   * Every Request Logging
   * =======================
   */
  app.use((req, res, next) => {
    requestLogger.info(`Incoming Request: ${req.method} ${req.url}`);
    next();
  });

  /**
   * =======================
   * File Based Routes Config
   * =======================
   */
  const fileRouter = await initFileRouter({
    baseDir: `./api`,
  });
  app.use("/api", fileRouter);

  /**
   * =======================
   * Health Checking
   * =======================
   */
  app.get("/", (req, res) => {
    return res.json(successResponse(200, "OK"));
  });

  /**
   * =======================
   * Log errors and send an error responseg
   * =======================
   */
  // eslint-disable-next-line no-unused-vars
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    generalLogger.error(`Error: ${err?.message || ""}`, { stack: err.stack });
    res.status(500).send(successResponse(500, "Internal Server Error"));
  });

  /**
   * =======================
   * Listening
   * =======================
   */
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

startServer();
