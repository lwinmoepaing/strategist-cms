import { Request, Response } from "express";
import { getCurrentUserHandler } from "../../../features/v1/auth/controller/auth.controller";
import { errorHandler } from "../../../util/response";
import { validateAuthMiddleware } from "../../../features/v1/auth/middleware/auth.middleware";

export default async function UserVerify(req: Request, res: Response) {
  try {
    validateAuthMiddleware(req, res);
    await getCurrentUserHandler(req, res);
  } catch (err) {
    errorHandler(err, res);
  }
}
