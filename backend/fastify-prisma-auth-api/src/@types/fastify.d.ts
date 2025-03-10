import fastify from "fastify";
import type { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    config: {
      PORT: number;
      NODE_ENV: "development" | "production" | "test";
      CORS_ALLOWED_ORIGINS?: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      COOKIE_SECRET: string;
    };
  }
}
