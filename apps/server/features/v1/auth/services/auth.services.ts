/**
 * Auth Services
 */
import { DocumentType } from "@typegoose/typegoose";
import { omit } from "lodash";
import { metricDbHelper } from "../../../../lib/metrics";
import UserSessionModel from "../../../../models/Users/user-session.model";
import UserModel, {
  User,
  privateFields,
} from "../../../../models/Users/user.model";
import { CreateUserInput } from "../schema/auth.schema";
import { signJWT } from "./jwt.services";

export const createUser = async (input: CreateUserInput) => {
  const userCreateFn = () => {
    return UserModel.create(input);
  };
  return metricDbHelper(userCreateFn, "createUser");
};

export const findUserById = (userId: string) => {
  const findByIdFn = () => {
    return UserModel.findById(userId);
  };
  return metricDbHelper(findByIdFn, "findUserById");
};

export const findUserByEmail = (email: string) => {
  const findUserByEmailFn = () => {
    return UserModel.findOne({ email });
  };
  return metricDbHelper(findUserByEmailFn, "findUserByEmail");
};

export const signAccessToken = (user: DocumentType<User>) => {
  const data = omit(user.toJSON(), privateFields);
  const accessToken = signJWT(data, "accessTokenPrivate", { expiresIn: "3m" });
  return accessToken;
};

export const signRefreshToken = async ({ userId }: { userId: string }) => {
  const session = await createSession({ userId: userId });
  const refreshToken = signJWT(
    { session: session._id },
    "refreshTokenPrivate",
    { expiresIn: "90 days" },
  );
  return refreshToken;
};

export const createSession = async ({ userId }: { userId: string }) => {
  const createSessionFn = () => {
    return UserSessionModel.create({ user: userId });
  };
  return metricDbHelper(createSessionFn, "createSession");
};

export const findSessionById = (id: string) => {
  const findSessionByIdFn = () => {
    return UserSessionModel.findById(id);
  };
  return metricDbHelper(findSessionByIdFn, "findSessionById");
};
