import { Schema, type Document } from "mongoose";
import type mongoose from "mongoose";
import type { VerificationEnum } from "../../common/enums/verification-code.enum";

export interface VerificationCodeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  type: VerificationEnum;
  expiredAt: Date;
  createdAt: Date;
}
