import { Request, Response } from "express";
import { successResponse } from "../../util/response";

export default {
  get: (req: Request, res: Response) => {
    return res.json(successResponse(200, "Hello"));
  },
};
