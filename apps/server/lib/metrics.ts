import { config } from "dotenv";
import express from "express";
import path from "path";
import client from "prom-client";
import serverConfig from "../config/server.config";
import { successResponse } from "../util/response";

// Dotenv configuration
config({
  path: path.join(__dirname, "../", ".env"),
});

export const restResponseTimeHistogram = new client.Histogram({
  name: "rest_response_time_duration_seconds",
  help: "REST API response time in seconds",
  labelNames: ["method", "route", "status_code"],
});

export const databaseResponseTimeHistogram = new client.Histogram({
  name: "db_response_time_duration_seconds",
  help: "Database response time in seconds",
  labelNames: ["operation", "success"],
});

export const metricDbHelper = async <T>(
  fn: () => Promise<T>,
  metricsLabel: string,
) => {
  if (!serverConfig.config.isMetricsStart) {
    const data = await fn();
    return data;
  } else {
    const metricsLabels = {
      operation: metricsLabel,
    };
    const timer = databaseResponseTimeHistogram.startTimer();
    try {
      const data = await fn();
      timer({ ...metricsLabels, success: "true" });
      return data;
    } catch (err) {
      timer({ ...metricsLabels, success: "false" });
      throw err;
    }
  }
};

const startMetricServer = async () => {
  const app = express();

  const { metricPort } = serverConfig.config;

  /**
   * =======================
   * Collect Metrics Rules
   * =======================
   */
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();

  /**
   * =======================
   * Health Checking
   * =======================
   */
  app.get("/", (req, res) => {
    return successResponse(res, 200, "OK from Metric Server");
  });

  /**
   * =======================
   * Get Metric Setup
   * =======================
   */
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    return res.send(await client.register.metrics());
  });

  /**
   * =======================
   * Listening
   * =======================
   */
  app.listen(metricPort, () => {
    console.log(`MetricServer is running at http://localhost:${metricPort}`);
  });
};

export default startMetricServer;
