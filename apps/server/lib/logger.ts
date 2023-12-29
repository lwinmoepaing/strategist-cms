import winston from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";
import winstonMongoDB from "winston-mongodb";
import path from "path";
import { config } from "dotenv";

config({
  path: path.join(__dirname, "../", ".env"),
});

const logsDir = "logs";

// Ensure the logs directory exists
if (!winston.transports.File) {
  require("winston-daily-rotate-file");
}
if (!winston.transports.MongoDB) {
  require("winston-mongodb");
}

const generalLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winstonDailyRotateFile({
      filename: path.join(logsDir, "application", "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

const requestLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winstonDailyRotateFile({
      filename: path.join(logsDir, "request", "requests-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

const mongoDbErrorLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winstonDailyRotateFile({
      filename: path.join(logsDir, "db", "mongodb-errors-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new winstonMongoDB.MongoDB({
      db: process.env.DB_URL || "",
      options: { useUnifiedTopology: true },
      level: "error",
    }),
  ],
});

const errorLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winstonDailyRotateFile({
      filename: path.join(logsDir, "error", "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export { generalLogger, requestLogger, mongoDbErrorLogger, errorLogger };
