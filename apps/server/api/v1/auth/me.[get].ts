import { Request, Response } from "express";
import { getCurrentUserHandler } from "../../../features/v1/auth/controller/auth.controller";
import { errorHandler } from "../../../util/response";

export default async function UserVerify(req: Request, res: Response) {
  try {
    await getCurrentUserHandler(req, res);
  } catch (err) {
    errorHandler(err, res);
  }
}
