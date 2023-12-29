import { StatusCodes } from "http-status-codes";
import type { IncomingMessage, ServerResponse } from "node:http";

export default function notFoundHandler(
  _: IncomingMessage,
  res: ServerResponse,
) {
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      statusCode: StatusCodes.NOT_FOUND,
      message: "Not Found",
    }),
  );
}
