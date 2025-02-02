import "dotenv/config";
import Fastify, { type FastifyRequest, type FastifyReply } from "fastify";
//import fastifyPassport from "@fastify/passport";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import secureSession from "@fastify/secure-session";
import flash from "@fastify/flash";
import { config } from "./modules/config/app.config";
import connectDatabase from "./modules/database/database";
import { errorHandler } from "./modules/middlewares/errorHandler";
import { asyncHandler } from "./modules/middlewares/asyncHandler";
import authRoutes from "./modules/auth/auth.routes";
import { HTTPSTATUS } from "./modules/config/http.config";
import fastifyPassport, {
  initializePassport,
} from "./modules/middlewares/passport";

const BASE_PATH = config.BASE_PATH;

const fastify = Fastify({
  logger: config.NODE_ENV === "development" && true,
});

const start = async () => {
  try {
    // Register plugins
    await fastify.register(cookie);
    await fastify.register(cors, {
      origin: config.APP_ORIGIN,
      credentials: true,
    });

    // Configure secure session before flash
    await fastify.register(secureSession, {
      // Using a 32-byte key for secure session
      secret: Buffer.from(
        "5d41402abc4b2a76b9719d911017c592f5d41402abc4b2a76b9719d911017c592",
        "hex"
      ),
      salt: "mq9hDxBVDbspDR6n",
      cookieName: "sessionId",
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      },
    });

    // Register flash after session if not already registered
    if (!fastify.hasDecorator("flash")) {
      await fastify.register(flash);
    }

    // Temporarily disable passport initialization for debugging
    // await initializePassport(fastify);

    // Register the error handler
    fastify.setErrorHandler(errorHandler);

    // Register auth routes with prefix
    await fastify.register(authRoutes, { prefix: `${BASE_PATH}/auth` });

    // Routes
    fastify.get(
      "/",
      asyncHandler(async (req: FastifyRequest, res: FastifyReply) => {
        res.status(HTTPSTATUS.OK).send({ message: "Hello" });
      })
    );

    // Connect to database
    await connectDatabase();

    // Start server
    await fastify.listen({ port: Number(config.PORT) });
    console.log(
      `\u2705  Server listening on port ${config.PORT} in ${config.NODE_ENV} \u{1F310}`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
