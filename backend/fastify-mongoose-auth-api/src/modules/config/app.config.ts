import { getEnv } from "../common/utils/get-env";
//import type { StringValue } from "jsonwebtoken";

interface JWTConfig {
  SECRET: string;
  EXPIRES_IN: string;
  REFRESH_SECRET: string;
  REFRESH_EXPIRES_IN: string;
}

interface AppConfig {
  NODE_ENV: string;
  APP_ORIGIN: string;
  PORT: string;
  BASE_PATH: string;
  MONGO_URI: string;
  JWT: JWTConfig;
  RESEND_API_KEY: string;
  MAILER_SENDER: string;
}

const appConfig = (): AppConfig => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  APP_ORIGIN: getEnv("APP_ORIGIN", "localhost"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
  MONGO_URI: getEnv("MONGO_URI"),
  JWT: {
    SECRET: getEnv("JWT_SECRET"),
    EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m"),
    REFRESH_SECRET: getEnv("JWT_REFRESH_TOKEN"),
    REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "30d"),
  },
  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
  MAILER_SENDER: getEnv("MAILER_SENDER"),
});

export const config = appConfig();
