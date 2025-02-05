import jwt from "jsonwebtoken";
import type { SignOptions, VerifyOptions } from "jsonwebtoken";
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
  expiresIn: config.JWT.EXPIRES_IN as jwt.SignOptions["expiresIn"],
  secret: config.JWT.SECRET,
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
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

export const verifyJwtToken = <TPayload extends object = AccessPayLoad>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  try {
    const { secret = config.JWT.SECRET, ...opts } = options || {};
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...opts,
    }) as TPayload;
    return { payload };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (err: any) {
    return { error: err.message };
  }
};
