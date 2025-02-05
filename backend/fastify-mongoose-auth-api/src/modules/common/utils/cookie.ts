import type { FastifyReply } from "fastify";
import { config } from "../../config/app.config";
import { calculateExpirationDate } from "./date-time";

type CookiePayloadType = {
  res: FastifyReply;
  accessToken: string;
  refreshToken: string;
};

const defaults = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: config.NODE_ENV === "production" ? "strict" : "lax",
} as const;

export const REFRESH_PATH = `${config.BASE_PATH}/auth/refresh`;

export const getRefreshTokenCookieOptions = () => {
  const expiresIn = config.JWT.REFRESH_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);
  return {
    ...defaults,
    expires,
    path: REFRESH_PATH,
  };
};

export const getAccessTokenCookieOptions = () => {
  const expiresIn = config.JWT.EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);
  return {
    ...defaults,
    expires,
    path: "/",
  };
};

export const setAuthenticationCookies = ({
  res,
  accessToken,
  refreshToken,
}: CookiePayloadType): FastifyReply => {
  res
    .setCookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .setCookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

  return res;
};

export const clearAuthenticationCookies = (res: FastifyReply): FastifyReply => {
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken", { path: REFRESH_PATH });
};
