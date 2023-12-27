import { Request, Response } from "express";
import { errorHandler, successResponse } from "../../../util/response";
import { createTestEmailFromEtheral } from "../../../features/v1/mail/services/mail.services";

export default async function CreateTestMail(req: Request, res: Response) {
  try {
    const testMail = await createTestEmailFromEtheral();
    return res.status(200).json(successResponse(200, "New TestMail", testMail));
  } catch (err) {
    errorHandler(err, res);
  }
}
