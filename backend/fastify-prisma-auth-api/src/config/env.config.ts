import { join } from "node:path";

// Opções para o plugin @fastify/env
export const fastifyEnvOptions = {
  confKey: "config",
  schema: {
    type: "object",
    required: [
      "PORT",
      "NODE_ENV",
      "DATABASE_URL",
      "JWT_SECRET",
      "COOKIE_SECRET",
    ],
    properties: {
      PORT: {
        type: "number",
        default: 8000,
      },
      NODE_ENV: {
        type: "string",
        enum: ["development", "production", "test"],
        default: "production",
      },
      CORS_ALLOWED_ORIGINS: {
        type: "string",
      },
      DATABASE_URL: {
        type: "string",
      },
      JWT_SECRET: { type: "string" },
      COOKIE_SECRET: { type: "string" },
    },
  },
  dotenv: {
    path: join(__dirname, "../../.env"),
    parseValues: true, // Ativa a conversão automática de tipo
  },
};
// Tipagem para acessar config com segurança
export type EnvConfig = {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  CORS_ALLOWED_ORIGINS?: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  COOKIE_SECRET: string;
};
