import { Express } from "express";
import path from "path";
import swaggerJsdoc, { OAS3Options } from "swagger-jsdoc";
import swaggerUi, { SwaggerUiOptions } from "swagger-ui-express";

export default async (app: Express) => {
  const swaggerOptions: OAS3Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Strategist-CMS API Documentation",
        version: "alpha-0.0.1",
      },
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

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
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
