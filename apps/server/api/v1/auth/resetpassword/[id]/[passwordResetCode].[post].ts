import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../../../../../util/response";
import { resetPasswordHandler } from "../../../../../features/v1/auth/controller/auth.controller";
import { validateResource } from "../../../../../lib/validateResource";
import { resetPasswordSchema } from "../../../../../features/v1/auth/schema/auth.schema";

interface IRouterParam {
  id: string;
  passwordResetCode: string;
}

export default async function UserForgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
  routerParam: IRouterParam
) {
  try {
    const modReq = req;
    modReq.params.id = routerParam.id;
    modReq.params.passwordResetCode = routerParam.passwordResetCode;
    await validateResource(resetPasswordSchema, modReq);
    await resetPasswordHandler(req, res, routerParam);
  } catch (err) {
    errorHandler(err, res);
  }
}
