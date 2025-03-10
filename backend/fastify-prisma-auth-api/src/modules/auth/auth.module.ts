// No arquivo auth.module.ts (que deve ser criado ou modificado)
import type { FastifyInstance } from "fastify";
import { AuthService } from "./auth.service";

let authService: AuthService;

export function initAuthModule(app: FastifyInstance) {
  authService = new AuthService(app);
  return authService;
}

export function getAuthService() {
  if (!authService) {
    throw new Error("AuthService não foi inicializado");
  }
  return authService;
}
