import { Request, Response } from "express";
import { createUserHandler } from "../../../features/v1/auth/controller/auth.controller";
import { createUserSchema } from "../../../features/v1/auth/schema/auth.schema";
import { validateResource } from "../../../lib/validateResource";
import { errorHandler } from "../../../util/response";

export default async function UserRegister(req: Request, res: Response) {
  try {
    await validateResource(createUserSchema, req);
    await createUserHandler(req, res);
  } catch (err) {
    errorHandler(err, res);
  }
}
