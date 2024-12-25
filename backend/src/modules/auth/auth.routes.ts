import type { FastifyInstance } from "fastify";
import { authController } from "./auth.module";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", authController.register);
}

export default authRoutes;
