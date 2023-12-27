/**
 * Auth Controller
 */

import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../../../util/response";
import { CreateUserInput } from "../schema/auth.schema";
import { createUser } from "../services/auth.services";
import { sendEmail } from "../../mail/services/mail.services";
import serverConfig from "../../../../config/server.config";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  try {
    const body = req.body;
    const newUser = await createUser(body);
    const { user } = serverConfig.emailOptions;
    await sendEmail({
      from: user,
      to: newUser.email,
      subject: "Please Verify your account.",
      text: `Verification code ${newUser.verificationCode}. Id: ${newUser._id}`,
    });

    res.json(successResponse(200, "Successfully Created", newUser));
  } catch (error: any) {
    if (error.code === 11000 || error.code === 11001) {
      return res.status(409).json(errorResponse(409, "Already account exists"));
    }

    res.json(errorResponse(500, "Something went wrong", null));
  }
};
