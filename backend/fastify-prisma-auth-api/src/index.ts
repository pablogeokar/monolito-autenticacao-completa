import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import cors from "@fastify/cors";
import { type EnvConfig, fastifyEnvOptions } from "./config/env.config";
import { getCorsOptions } from "./config/cors.config";
import prismaPlugin from "./plugins/prisma";
import { registerRoutes } from "./utils/register-routes";
import { printRoutes } from "./utils/print-routes";

const start = async () => {
  try {
    const fastify = Fastify({
      //logger: true,
      logger: {
        level: "info", // Níveis: fatal, error, warn, info, debug, trace
        timestamp: true, // Adiciona timestamp
        formatters: {
          level: (label) => {
            return { level: label.toUpperCase() };
          },
        },
        transport: {
          target: "pino-pretty", // Torna os logs mais legíveis
          options: {
            colorize: true, // Adiciona cores
            translateTime: "SYS:standard", // Formata o timestamp
            ignore: "pid,hostname,reqId", // Ignora campos específicos
          },
        },
      },
    });

    // Registra o plugin @fastify/env com nossas configurações
    await fastify.register(fastifyEnv, fastifyEnvOptions);

    // registra o prisma como plugin, visando o correto gerenciamento das instâncias do prisma
    await fastify.register(prismaPlugin);

    // Usa a tipagem para garantir acesso seguro aos valores
    const config = fastify.config as EnvConfig;

    // Obtém as opções do CORS baseadas na configuração
    const corsOptions = getCorsOptions(config);

    // Registra o plugin de CORS com as opções definidas no arquivo de configuração
    await fastify.register(cors, corsOptions);

    // Ajusta o logger baseado no ambiente
    if (config.NODE_ENV !== "development") {
      fastify.log.level = "warn";
    }

    // Registra todas as rotas automaticamente
    await registerRoutes(fastify);

    // Exibe todas as rotas registradas formatadas
    fastify.ready(() => {
      printRoutes();
    });

    // Inicia o servidor
    await fastify.listen({ port: config.PORT, host: "0.0.0.0" });
    console.log(
      `🚀 Servidor rodando na porta ${config.PORT} em modo ${config.NODE_ENV}`,
      "\n======================================================="
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
