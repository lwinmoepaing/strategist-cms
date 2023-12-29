import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
import { User } from "./user.model";

export class UserSession {
  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ default: true })
  valid: boolean;
}

const UserSessionModel = getModelForClass(UserSession, {
  schemaOptions: {
    timestamps: true,
  },
});

export default UserSessionModel;
