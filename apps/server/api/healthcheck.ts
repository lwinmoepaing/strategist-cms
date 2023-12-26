import { Request, Response } from "express";
import { successResponse } from "../util/response";

export default {
  get: (req: Request, res: Response) => {
    return res.status(200).json(successResponse(200, "OK"));
  },
};
