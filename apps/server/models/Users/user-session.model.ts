import { Ref, getModelForClass, index, prop } from "@typegoose/typegoose";
import { User } from "./user.model";

@index({
  email: 1,
})
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
