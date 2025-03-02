import fastify from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      NODE_ENV: "development" | "production" | "test";
      CORS_ALLOWED_ORIGINS?: string;
    };
  }
}
