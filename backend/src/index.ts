import "dotenv/config";
import Fastify, { type FastifyRequest, type FastifyReply } from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { config } from "./modules/config/app.config";
import connectDatabase from "./modules/database/database";
import { errorHandler } from "./modules/middlewares/errorHandler";
import { asyncHandler } from "./modules/middlewares/asyncHandler";
import authRoutes from "./modules/auth/auth.routes";
import { HTTPSTATUS } from "./modules/config/http.config";

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
