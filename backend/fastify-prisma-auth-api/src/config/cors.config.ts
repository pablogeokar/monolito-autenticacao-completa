import type { EnvConfig } from "./env.config";

/**
 * Retorna as opções do CORS com base na configuração
 *
 * @param {Object} config - Objeto de configuração bruto do arquivo .env
 * @returns {EnvConfig} Objeto de configuração tipado e validado
 *
 * @example
 * const corsOptions = getCorsOptions(config);
 */
export function getCorsOptions(config: EnvConfig) {
  // Verifica se há origens definidas
  const origin = config.CORS_ALLOWED_ORIGINS
    ? config.CORS_ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : true;

  return {
    origin,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 horas
  };
}
