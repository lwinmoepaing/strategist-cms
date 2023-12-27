const serverConfig = {
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
} as const;

export default serverConfig;
