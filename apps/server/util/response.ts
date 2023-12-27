import { Response } from "express";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

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
  if (error instanceof ZodError) {
    const message = error instanceof Error ? "Invalid Data" : "Bad Request";
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse(StatusCodes.BAD_REQUEST, message, error?.errors));
  }

  const message = error instanceof Error ? "Sorry" : "Bad Request";
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, message, {}));
};
