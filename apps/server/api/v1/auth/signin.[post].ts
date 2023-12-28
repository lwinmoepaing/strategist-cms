import { Request, Response } from "express";
import { createUserSessionHandler } from "../../../features/v1/auth/controller/auth.controller";
import {
  CreateUserSessionInput,
  createUserSessionSchema,
} from "../../../features/v1/auth/schema/auth.schema";
import { validateResource } from "../../../lib/validateResource";
import { errorHandler } from "../../../util/response";

export default async function UserVerify(
  req: Request<CreateUserSessionInput>,
  res: Response
) {
  try {
    await validateResource(createUserSessionSchema, req);
    await createUserSessionHandler(req, res);
  } catch (err) {
    errorHandler(err, res);
  }
}
