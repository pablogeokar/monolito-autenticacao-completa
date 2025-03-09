import fastify from "fastify";
import type { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    config: {
      PORT: number;
      NODE_ENV: "development" | "production" | "test";
      CORS_ALLOWED_ORIGINS?: string;
      DATABASE_URL: string;
    };
  }
}
