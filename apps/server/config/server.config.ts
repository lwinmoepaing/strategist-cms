import { config } from "dotenv";
import path from "path";
config({
  path: path.join(__dirname, "../", ".env"),
});

const serverConfig = {
  config: {
    serverPort: process.env.SERVER_PORT || 3000,
    isMetricsStart: process.env.METRICS_START === "true",
    metricPort: process.env.METRICS_SERVER_PORT || 3000,
  },

  // For Open Api Documentation
  defaultOpenApiOptions: {
    openapi: "3.1.0",
    info: {
      title: "Strategist-CMS API Documentation",
      version: "alpha-0.0.1",
    },
  },

  // For Email SMTP Access
  emailOptions: {
    host: process.env.EMAIL_HOST || "",
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465,
    secure: process.env.EMAIL_SECURE === "true",
  },

  // Access Token Key
  token: {
    accessTokenPublic: process.env.ACCESS_TOKEN_PUBLIC || "",
    accessTokenPrivate: process.env.ACCESS_TOKEN_PRIVATE || "",
    refreshTokenPublic: process.env.REFRESH_TOKEN_PUBLIC || "",
    refreshTokenPrivate: process.env.REFRESH_TOKEN_PRIVATE || "",
  },
} as const;

export default serverConfig;
