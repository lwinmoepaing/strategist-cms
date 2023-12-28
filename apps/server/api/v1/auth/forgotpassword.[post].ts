import { Request, Response } from "express";
import { forgerPasswordHandler } from "../../../features/v1/auth/controller/auth.controller";
import { forgetPasswordSchema } from "../../../features/v1/auth/schema/auth.schema";
import { validateResource } from "../../../lib/validateResource";
import { errorHandler } from "../../../util/response";

export default async function UserForgotPassword(req: Request, res: Response) {
  try {
    await validateResource(forgetPasswordSchema, req);
    await forgerPasswordHandler(req, res);
  } catch (err) {
    errorHandler(err, res);
  }
}
