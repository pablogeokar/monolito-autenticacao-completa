import "dotenv/config";
import Fastify, { type FastifyRequest, type FastifyReply } from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { config } from "./modules/config/app.config";
import connectDatabase from "./modules/database/database";
import { errorHandler } from "./modules/middlewares/errorHandler";

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

    // Routes
    fastify.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
      return { message: "Hello" };
    });

    // Connect to database
    await connectDatabase();

    // Start server
    await fastify.listen({ port: Number(config.PORT) });
    console.log(
      `\u2705 Server listening on port ${config.PORT} in ${config.NODE_ENV}`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
