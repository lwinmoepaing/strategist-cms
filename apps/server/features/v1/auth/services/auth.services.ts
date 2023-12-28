/**
 * Auth Services
 */

import UserModel from "../../../../models/Users/user.model";
import { CreateUserInput } from "../schema/auth.schema";

export const createUser = (input: CreateUserInput) => {
  return UserModel.create(input);
};

export const findUserById = (userId: string) => {
  return UserModel.findById(userId);
};

export const findUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};
