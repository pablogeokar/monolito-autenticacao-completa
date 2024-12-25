import { getEnv } from "../common/utils/get-env";

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
}

const appConfig = (): AppConfig => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  APP_ORIGIN: getEnv("APP_ORIGIN", "localhost"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
  MONGO_URI: getEnv("MONGO_URI"),
  JWT: {
    SECRET: getEnv("JWT_SECRET"),
    EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "1h"),
    REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
    REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN"),
  },
});

export const config = appConfig();
