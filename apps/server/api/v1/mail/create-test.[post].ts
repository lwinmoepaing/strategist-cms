import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { errorHandler, successResponse } from "../../../util/response";
import { createTestEmailFromEtheral } from "../../../features/v1/mail/services/mail.services";

export default async function CreateTestMail(req: Request, res: Response) {
  try {
    const testMail = await createTestEmailFromEtheral();
    return res
      .status(StatusCodes.OK)
      .json(successResponse(StatusCodes.OK, "New TestMail", testMail));
  } catch (err) {
    errorHandler(err, res);
  }
}
