import mongoose, { type Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../../common/utils/bcrypt";

interface UserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  userPreferences: UserPreferences;
  comparePassword(value: string): Promise<boolean>;
}

const userPreferencesSchema = new Schema<UserPreferences>({
  enable2FA: { type: Boolean, default: false },
  emailNotification: { type: Boolean, default: true },
  twoFactorSecret: { type: String, required: false },
});

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    userPreferences: { type: userPreferencesSchema, default: {} },
  },
  { timestamps: true, toJSON: {} }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashValue(this.password);
  }
  next();
});

userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    // biome-ignore lint/performance/noDelete: <explanation>
    delete ret.password;
    // biome-ignore lint/performance/noDelete: <explanation>
    delete ret.userPreferences.twoFactorSecret;
    return ret;
  },
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
