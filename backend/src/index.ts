// index.ts
import "dotenv/config";
import Fastify, { type FastifyRequest, type FastifyReply } from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { config } from "./modules/config/app.config";

const fastify = Fastify({
  logger: true,
});

// Register plugins
fastify.register(cookie);
fastify.register(cors, {
  origin: config.APP_ORIGIN,
  credentials: true,
});

// Routes
fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
  return { message: "Hello" };
});

// Start server
try {
  fastify.listen({ port: Number(config.PORT) });
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
