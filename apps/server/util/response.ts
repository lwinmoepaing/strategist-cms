import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { TokenAccessError } from "../features/v1/auth/middleware/auth.middleware";
import { errorLogger } from "../lib/logger";

export const successResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};

export const errorResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) => {
  const errorCode: number = 1;
  return res.status(StatusCodes.UNAUTHORIZED).json({
    errorCode: errorCode,
    statusCode,
    message,
    data,
  });
};

export const errorHandler = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    errorLogger.error(`Error: ${error?.message || ""}`, {
      stack: error.stack,
    });
  }

  if (error instanceof TokenAccessError) {
    if (error.code === 401) {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, error.message);
    }
  }

  if (error instanceof ZodError) {
    const message = error instanceof Error ? "Invalid Data" : "Bad Request";
    return errorResponse(res, StatusCodes.BAD_REQUEST, message, error?.errors);
  }

  const mError = error as any;
  if (mError?.name === "MongoServerError" && mError?.code === 11000) {
    return errorResponse(
      res,
      StatusCodes.CONFLICT,
      "Already an account exists",
    );
  }

  const message =
    error instanceof Error ? "Something went wrong" : "Bad Request";

  return errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, message, {});
};
