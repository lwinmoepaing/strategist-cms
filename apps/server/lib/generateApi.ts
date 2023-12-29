import * as fs from "fs";
import * as path from "path";
import { errorLogger } from "./logger";

let swaggerObjects = {
  paths: {},
  components: {
    schemas: {},
  },
};

async function itrateApiDocs(directory: string) {
  const files = await fs.promises.readdir(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      // If it's a directory, recursively process its contents
      await itrateApiDocs(filePath);
    } else if (file.endsWith(".api-doc.ts")) {
      // If it's a *.api-doc.ts file, perform your require or other actions
      try {
        const swaggerApiDoc = require(filePath);
        // Do something with the swaggerApiDoc...]
        if (swaggerApiDoc?.generateAPI) {
          const { components, paths } = swaggerApiDoc.generateAPI();
          swaggerObjects = {
            components: {
              schemas: {
                ...swaggerObjects.components.schemas,
                ...components.schemas,
              },
            },
            paths: {
              ...swaggerObjects.paths,
              ...paths,
            },
          };
        }
      } catch (error: any) {
        errorLogger.error(
          `Error processing file ${filePath}: ${error.message}`,
        );
      }
    }
  }
}

async function generateApi() {
  const rootFolder = path.join(__dirname, "../", "features"); // Change this to your actual root folder

  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    await itrateApiDocs(rootFolder);
  }

  return swaggerObjects;
}

export default generateApi;
