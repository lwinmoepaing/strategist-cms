/**
 * Auth Middlewares
 */

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class TokenAccessError extends Error {
  code = StatusCodes.UNAUTHORIZED as const;
  constructor(message: string) {
    super(message);
    this.name = "TokenAccessError";
  }
}

export const validateAuthMiddleware = (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) {
    throw new TokenAccessError("Unauthorized access token");
  }
};
