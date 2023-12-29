import { Request, Response } from "express";
import { refreshAccessTokenHandler } from "../../../features/v1/auth/controller/auth.controller";
import { errorHandler } from "../../../util/response";

export default async function RefreshAccessToken(req: Request, res: Response) {
  try {
    await refreshAccessTokenHandler(req, res);
  } catch (err) {
    errorHandler(err, res);
  }
}
