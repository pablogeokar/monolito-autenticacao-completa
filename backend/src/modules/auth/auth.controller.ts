import type { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../middlewares/asyncHandler";
import type { AuthService } from "./auth.service";
import { HTTPSTATUS } from "../config/http.config";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationEmailSchema,
} from "../common/validators/auth.validator";
import {
  clearAuthenticationCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthenticationCookies,
} from "../common/utils/cookie";
import { UnauthorizedException } from "../common/utils/catch-errors";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const body = registerSchema.parse({
        ...(req.body as Record<string, unknown>),
      });

      const { user } = await this.authService.register(body);

      return res.status(HTTPSTATUS.CREATED).send({
        message: "User registered succesfully",
        data: user,
      });
    }
  );

  public login = asyncHandler(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const userAgent = req.headers["user-agent"];
      const body = loginSchema.parse({
        ...(req.body as Record<string, unknown>),
        userAgent,
      });

      const { user, accessToken, refreshToken, mfaRequired } =
        await this.authService.login(body);

      return setAuthenticationCookies({ res, accessToken, refreshToken })
        .status(HTTPSTATUS.OK)
        .send({
          message: "User login succesfully",
          user,
        });
    }
  );

  public refreshToken = asyncHandler(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const refreshToken = req.cookies.refreshToken as string | undefined;
      if (!refreshToken) {
        throw new UnauthorizedException("Missing refresh token");
      }

      const { accessToken, newRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      if (newRefreshToken) {
        res.setCookie(
          "refreshToken",
          newRefreshToken,
          getRefreshTokenCookieOptions()
        );

        return res
          .status(HTTPSTATUS.OK)
          .setCookie("accessToken", accessToken, getAccessTokenCookieOptions())
          .send({
            message: "Refresh access token successfuly",
          });
      }
    }
  );

  public verifyEmail = asyncHandler(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const { code } = verificationEmailSchema.parse(req.body);
      await this.authService.verifyEmail(code);

      return res
        .status(HTTPSTATUS.OK)
        .send({ message: "Email verified successfully" });
    }
  );

  public forgotPassword = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      const email = emailSchema.parse((req.body as { email: string }).email);
      await this.authService.forgotPassword(email);

      return res.status(HTTPSTATUS.OK).send({
        message: "Password reset email sent",
      });
    }
  );

  public resetPassword = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      const body = resetPasswordSchema.parse(req.body);

      await this.authService.resetPassword(body);

      return clearAuthenticationCookies(res).status(HTTPSTATUS.OK).send({
        message: "Reset password successfuly",
      });
    }
  );
}
