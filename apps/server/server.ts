import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { initFileRouter } from "node-file-router";
import path from "path";
import responseTime from "response-time";
import serverConfig from "./config/server.config";
import { dbConnect } from "./lib/dbConnect";
import { deserializeUser } from "./lib/deserializeUser";
import { errorLogger, requestLogger } from "./lib/logger";
import startMetricServer, { restResponseTimeHistogram } from "./lib/metrics";
import swaggerApi from "./lib/swaggerApi";
import { successResponse } from "./util/response";

const startServer = async () => {
  const app = express();
  // Dotenv configuration
  config({
    path: path.join(__dirname, ".env"),
  });

  const { serverPort: port, isMetricsStart } = serverConfig.config;

  /**
   * =======================
   * Connect Database
   * =======================
   */
  dbConnect();

  /**
   * =======================
   * Security with HTTP headers
   * =======================
   * @doc : https://helmetjs.github.io/
   *
   */
  app.use(helmet());

  /**
   * =======================
   * For parsing data for body payload
   * =======================
   */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  /**
   * =======================
   * Cross Origin Resource Sharing
   * =======================
   */
  app.use(cors());

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
   * Deserialization User
   * =======================
   */
  app.use(deserializeUser);

  /**
   * =========================
   * Metrics For Response Time
   * =========================
   */
  if (isMetricsStart) {
    app.use(
      responseTime((req: Request, res: Response, time: number) => {
        if (req?.route?.path) {
          restResponseTimeHistogram.observe(
            {
              method: req.method,
              route: req.route.path,
              status_code: res.statusCode,
            },
            time * 1000,
          );
        }
      }),
    );
  }

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
   * @openapi
   * /:
   *   get:
   *     tags:
   *       - Health check
   *     description: "Response if the app is running"
   *     responses:
   *       200:
   *         description: "App is up and running"
   */
  app.get("/", (req, res) => {
    return successResponse(res, 200, "OK");
  });

  /**
   * =======================
   * Swagger API Setup
   * =======================
   */
  await swaggerApi(app);

  /**
   * =======================
   * Handling 404 pages
   * =======================
   */
  app.get("*", (req, res) => {
    return successResponse(res, 404, "Not Found");
  });

  /**
   * =======================
   * Log errors and send an error responseg
   * =======================
   */
  // eslint-disable-next-line no-unused-vars
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    errorLogger.error(`Error: ${err?.message || ""}`, { stack: err.stack });
    successResponse(res, 500, "Internal Server Error");
  });

  /**
   * =======================
   * Listening
   * =======================
   */
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);

    if (isMetricsStart) {
      startMetricServer();
    }
  });
};

startServer();
