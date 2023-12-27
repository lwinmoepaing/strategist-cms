/**
 * Auth Services
 */

import UserModel from "../../../../models/Users/user.model";
import { CreateUserInput } from "../schema/auth.schema";

export const createUser = (input: CreateUserInput) => {
  const newUser = UserModel.create(input);
  return newUser;
};
