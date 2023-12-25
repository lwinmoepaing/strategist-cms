import { Express } from "express";
import path from "path";
import swaggerJsdoc, { OAS3Options } from "swagger-jsdoc";
import swaggerUi, { SwaggerUiOptions } from "swagger-ui-express";
import generateApi from "./generateApi";
import serverConfig from "../config/server.config";

export default async (app: Express) => {
  const swaggerOptions: OAS3Options = {
    definition: {
      ...serverConfig.defaultOpenApiOptions,
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: [path.join(__dirname, "../", "**/*.ts")], // point to your route files
  };

  const swaggerSpec: any = swaggerJsdoc(swaggerOptions);

  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    const swagger = await generateApi();
    swaggerSpec.paths = { ...swaggerSpec.paths, ...swagger.paths };
    swaggerSpec.components = {
      ...swaggerSpec.components,
      ...swagger.components,
    };
  }

  const swaggerUiOption: SwaggerUiOptions = {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }

      .swagger-ui .info {
        margin-top: 40px;
        margin-bottom: 20px;
      }

      .swagger-ui .scheme-container { 
        margin-left: 40px; 
        margin-right: 40px; 
        border-radius: 10px
      }
      .swagger-ui .wrapper {
        padding-left: 40px; 
        padding-right: 40px; 
      }

      .swagger-ui .info .title span {
        display: flex;
        height: 40px;
        justify-content: flex-start;
        align-items: center;
      }
      .swagger-ui .info .title small {
        top: 0;
      }
    `,
    customSiteTitle: "Strategist-CMS API",
  };

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOption)
  );
};
