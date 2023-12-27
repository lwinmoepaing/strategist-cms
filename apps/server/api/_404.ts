import type { IncomingMessage, ServerResponse } from "node:http";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../util/response";

export default function notFoundHandler(
  _: IncomingMessage,
  res: ServerResponse
) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(successResponse(StatusCodes.NOT_FOUND, "Not Found")));
}
