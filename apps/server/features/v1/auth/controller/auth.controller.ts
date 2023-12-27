/**
 * Auth Controller
 */
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../../../util/response";
import { CreateUserInput, VerifyUserInput } from "../schema/auth.schema";
import { createUser, findUserById } from "../services/auth.services";
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

    res
      .status(StatusCodes.OK)
      .json(successResponse(StatusCodes.OK, "Successfully Created", newUser));
  } catch (error: any) {
    if (error.code === 11000 || error.code === 11001) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(errorResponse(StatusCodes.CONFLICT, "Already account exists"));
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Something went wrong",
          null
        )
      );
  }
};

export const verifyUserHandler = async (
  req: Request<VerifyUserInput>,
  res: Response
) => {
  try {
    const id = req.query.id as string;
    const verificationCode = req.query.verificationCode;
    const user = await findUserById(id);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(errorResponse(StatusCodes.UNAUTHORIZED, "User Not Found"));
    }

    if (user.verified === true) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(errorResponse(StatusCodes.BAD_REQUEST, "Could not verify user"));
    }

    if (verificationCode === user.verificationCode) {
      user.verified = true;
      await user.save();
      return res
        .status(StatusCodes.OK)
        .json(successResponse(StatusCodes.OK, "User successfully verified"));
    }

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse(StatusCodes.BAD_REQUEST, "Could not verify user"));
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        errorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Something went wrong",
          null
        )
      );
  }
};
