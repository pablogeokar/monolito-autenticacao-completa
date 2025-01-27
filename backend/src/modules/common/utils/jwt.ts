import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { SessionDocument } from "../../database/models/session.model";
import type { UserDocument } from "../../database/models/user.model";
import { config } from "../../config/app.config";

export type AccessPayLoad = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};

export type RefreshPayLoad = {
  sessionId: SessionDocument["_id"];
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.EXPIRES_IN,
  secret: config.JWT.SECRET,
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.REFRESH_EXPIRES_IN,
  secret: config.JWT.REFRESH_SECRET,
};

export const signJwtToken = (
  payload: AccessPayLoad | RefreshPayLoad,
  options?: SignOptsAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
};
