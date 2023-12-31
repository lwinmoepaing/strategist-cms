import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import serverConfig from "../../../../config/server.config";

const { object } = z;
extendZodWithOpenApi(z);

export const UserSchema = object({
  id: z.string().openapi({ example: "1212121" }),
  name: z.string().openapi({ example: "John Doe" }),
  age: z.number().openapi({ example: 42 }),
}).openapi("User");


export const generateAPI = () => {
  const registry = new OpenAPIRegistry();

  const componenetGen = new OpenApiGeneratorV3([UserSchema ]);

  registry.registerPath({
    tags: ["Auth"],
    method: "post",
    path: "/users/register",
    summary: "Register User",
    request: {
      // body: createUserSchema.
    },
    responses: {
      200: {
        description: "Object with user data.",
        content: {
          "application/json": {
            schema: UserSchema,
          },
        },
      },
    },
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return {
    paths: generator.generateDocument(serverConfig.defaultOpenApiOptions).paths,
    components: componenetGen.generateComponents().components,
  };
};
