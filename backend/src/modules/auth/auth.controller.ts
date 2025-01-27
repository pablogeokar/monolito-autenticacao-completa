import type { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../middlewares/asyncHandler";
import type { AuthService } from "./auth.service";
import { HTTPSTATUS } from "../config/http.config";
import {
  loginSchema,
  registerSchema,
} from "../common/validators/auth.validator";
import { setAuthenticationCookies } from "../common/utils/cookie";
import { UnauthorizedException } from "../common/utils/catch-errors";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async (req: FastifyRequest, res: FastifyReply): Promise<any> => {
      const userAgent = req.headers["user-agent"];
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
        throw new UnauthorizedException("User not authorized");
      }

      await this.authService.refreshToken(refreshToken);
    }
  );
}
