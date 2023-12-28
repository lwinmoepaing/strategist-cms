import { Response } from "express";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { generalLogger } from "../lib/logger";
import { Error as MongooseError } from "mongoose";

export const successResponse = <T>(
  statusCode: number,
  message: string,
  data?: T
) => {
  return {
    statusCode,
    message,
    data,
  };
};

export const errorResponse = <T>(
  statusCode: number,
  message: string,
  data?: T
) => {
  const errorCode: number = 1;
  return {
    errorCode: errorCode,
    statusCode,
    message,
    data,
  };
};

export const errorHandler = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    generalLogger.error(`Error: ${error?.message || ""}`, {
      stack: error.stack,
    });
  }

  if (error instanceof MongooseError.OverwriteModelError) {
    if (error.name === "OverwriteModelError") {
      return res
        .status(StatusCodes.CONFLICT)
        .json(errorResponse(StatusCodes.CONFLICT, "Already account exists"));
    }
  }

  if (error instanceof ZodError) {
    const message = error instanceof Error ? "Invalid Data" : "Bad Request";
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse(StatusCodes.BAD_REQUEST, message, error?.errors));
  }

  const message =
    error instanceof Error ? "Something went wrong" : "Bad Request";
    
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, message, {}));
};
