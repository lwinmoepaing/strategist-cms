import { Request, Response } from "express";
import { successResponse } from "../../util/response";

export default {
  get: (req: Request, res: Response) => {
    return successResponse(res, 200, "Hello", null);
  },
};
