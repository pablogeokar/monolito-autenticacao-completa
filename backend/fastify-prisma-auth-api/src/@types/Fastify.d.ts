import fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { z } from "zod";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      NODE_ENV: "development" | "production" | "test";
      CORS_ALLOWED_ORIGINS?: string;
      DATABASE_URL: string;
    };
  }
}
