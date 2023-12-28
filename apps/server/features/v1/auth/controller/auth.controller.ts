/**
 * Auth Controller
 */
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { errorResponse, successResponse } from "../../../../util/response";
import {
  CreateUserInput,
  ForgotPasswordInput,
  VerifyUserInput,
} from "../schema/auth.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/auth.services";
import { sendEmail } from "../../mail/services/mail.services";
import serverConfig from "../../../../config/server.config";
import { generalLogger } from "../../../../lib/logger";

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

export const forgerPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    const message =
      "If user with that email is registered you will receive a password reset email";

    if (!user) {
      generalLogger.debug(`User with that email ${email} is not registered`);
      return res
        .status(StatusCodes.OK)
        .json(successResponse(StatusCodes.OK, message));
    }

    if (user.verified !== true) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(successResponse(StatusCodes.BAD_REQUEST, "User is not verified"));
    }

    const passwordResetCode = nanoid();
    user.passwordResetCode = passwordResetCode;
    await user.save();

    const { user: fronUser } = serverConfig.emailOptions;
    await sendEmail({
      from: fronUser,
      to: user.email,
      subject: "Please Verify your account.",
      text: `Password reset code: ${passwordResetCode}. Id: ${user.id}`,
    });

    generalLogger.debug(`Password reset sent to ${email}`);

    res.status(StatusCodes.OK).json(successResponse(StatusCodes.OK, message));
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
