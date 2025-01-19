import type { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler } from "../middlewares/asyncHandler";
import type { AuthService } from "./auth.service";
import { HTTPSTATUS } from "../config/http.config";
import { registerSchema } from "../common/validators/auth.validator";

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
        userAgent,
      });

      this.authService.register(body);

      return res.status(HTTPSTATUS.CREATED).send({
        message: "User registered succesfully",
      });
    }
  );
}
