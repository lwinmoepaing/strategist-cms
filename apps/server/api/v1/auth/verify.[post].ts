import { Request, Response } from "express";
import { validateResource } from "../../../lib/validateResource";
import { errorHandler } from "../../../util/response";
import {
  VerifyUserInput,
  verifyUserSchema,
} from "../../../features/v1/auth/schema/auth.schema";
import { verifyUserHandler } from "../../../features/v1/auth/controller/auth.controller";

export default async function UserVerify(
  req: Request<VerifyUserInput>,
  res: Response
) {
  try {
    await validateResource(verifyUserSchema, req);
    await verifyUserHandler(req, res);
  } catch (err) {
    errorHandler(err, res);
  }
}
