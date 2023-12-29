/**
 * Auth Controller
 */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import { nanoid } from "nanoid";
import serverConfig from "../../../../config/server.config";
import { generalLogger } from "../../../../lib/logger";
import {
  errorHandler,
  errorResponse,
  successResponse,
} from "../../../../util/response";
import { sendEmail } from "../../mail/services/mail.services";
import {
  CreateUserInput,
  CreateUserSessionInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/auth.schema";
import {
  createUser,
  findSessionById,
  findUserByEmail,
  findUserById,
  signAccessToken,
  signRefreshToken,
} from "../services/auth.services";
import { verifyJwt } from "../services/jwt.services";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
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

    const message = "Successfully Created";
    return successResponse(res, StatusCodes.OK, message, newUser);
  } catch (err) {
    errorHandler(err, res);
  }
};

export const verifyUserHandler = async (
  req: Request<VerifyUserInput>,
  res: Response,
) => {
  try {
    const id = req.query.id as string;
    const verificationCode = req.query.verificationCode;
    const user = await findUserById(id);
    if (!user) {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, "User Not Found");
    }

    if (user.verified === true) {
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Could not verify user",
      );
    }

    if (verificationCode === user.verificationCode) {
      user.verified = true;
      await user.save();
      return successResponse(res, StatusCodes.OK, "User successfully verified");
    }

    return errorResponse(res, StatusCodes.BAD_REQUEST, "Could not verify user");
  } catch (err) {
    errorHandler(err, res);
  }
};

export const forgerPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    const message =
      "If user with that email is registered you will receive a password reset email";

    if (!user) {
      generalLogger.debug(`User with that email ${email} is not registered`);
      return successResponse(res, StatusCodes.OK, message);
    }

    if (user.verified !== true) {
      const message = "User is not verified";
      return successResponse(res, StatusCodes.BAD_REQUEST, message);
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
    successResponse(res, StatusCodes.OK, message);
  } catch (err) {
    errorHandler(err, res);
  }
};

export const resetPasswordHandler = async (
  req: Request<{}, {}, ResetPasswordInput["body"]>,
  res: Response,
  routeParam: ResetPasswordInput["params"],
) => {
  try {
    const { id, passwordResetCode } = routeParam;
    const { password } = req.body;

    const user = await findUserById(id);

    if (
      !user ||
      !user.passwordResetCode ||
      user.passwordResetCode !== passwordResetCode
    ) {
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Could not reset user password",
      );
    }

    user.passwordResetCode = null;
    user.password = password;

    await user.save();
    successResponse(res, StatusCodes.OK, "Successfully updated user password");
  } catch (err) {
    errorHandler(err, res);
  }
};

export const createUserSessionHandler = async (
  req: Request<{}, {}, CreateUserSessionInput>,
  res: Response,
) => {
  try {
    const { email, password } = req.body;
    const message = "Invalid email or password";
    const user = await findUserByEmail(email);

    if (!user) {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, message);
    }

    if (user.verified !== true) {
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Please verify your email",
      );
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return errorResponse(res, StatusCodes.UNAUTHORIZED, message);
    }

    // Sign Access Token
    const accessToken = signAccessToken(user);

    // Sign Refresh Token
    const refreshToken = await signRefreshToken({ userId: user._id.toString() });

    // Send Tokens
    return successResponse(res, StatusCodes.OK, "Successfully signed ", {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

export const getCurrentUserHandler = async (req: Request, res: Response) => {
  try {
    const isValidToken = !!res.locals.user;
    if (!isValidToken) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, "Invalid token");
    }
    const message = "Get User Info";
    return successResponse(res, StatusCodes.OK, message, res.locals.user);
  } catch (err) {
    errorHandler(err, res);
  }
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
) => {
  const refreshToken = get(req.headers, "x-refresh") as string || "";
  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    "refreshTokenPublic",
  );

  if (!decoded) {
    return errorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Invalid Refresh Access token",
    );
  }

  const session = await findSessionById(decoded.session);
  if (!session || !session.valid) {
    const message = "Could not refresh access token";
    return errorResponse(res, StatusCodes.UNAUTHORIZED, message);
  }

  const user = await findUserById(session.user.toString());
  if (!user) {
    const message = "Not Found User ! Could not refresh access token";
    return errorResponse(res, StatusCodes.UNAUTHORIZED, message);
  }

  const accessToken = signAccessToken(user);
  const message = "Access token";
  return successResponse(res, StatusCodes.OK, message, { accessToken });
};
