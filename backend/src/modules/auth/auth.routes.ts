import type { FastifyInstance } from "fastify";
import { authController } from "./auth.module";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", authController.register);
  fastify.post("/login", authController.login);
  fastify.get("/refresh", authController.refreshToken);
}

export default authRoutes;
