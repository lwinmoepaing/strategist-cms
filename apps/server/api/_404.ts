import type { IncomingMessage, ServerResponse } from "node:http";
import { successResponse } from "../util/response";

export default function notFoundHandler(
  _: IncomingMessage,
  res: ServerResponse
) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(successResponse(404, "Not Found")));
}
