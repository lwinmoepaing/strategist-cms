/**
 * Auth Services
 */

import { DocumentType } from "@typegoose/typegoose";
import UserModel, { User } from "../../../../models/Users/user.model";
import { CreateUserInput } from "../schema/auth.schema";
import { singJWT } from "./jwt.services";
import UserSessionModel from "../../../../models/Users/user-session.model";

export const createUser = (input: CreateUserInput) => {
  return UserModel.create(input);
};

export const findUserById = (userId: string) => {
  return UserModel.findById(userId);
};

export const findUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

export const signAccessToken = (user: DocumentType<User>) => {
  const data = user.toJSON();
  const accessToken = singJWT(data, "accessTokenPrivate");
  return accessToken;
};

export const signRefreshToken = async ({ userId }: { userId: string }) => {
  const session = await createSession({ userId: userId });
  const refreshToken = singJWT({ session: session._id }, "refreshTokenPrivate");
  return refreshToken;
};

export const createSession = ({ userId }: { userId: string }) => {
  return UserSessionModel.create({ user: userId });
};
