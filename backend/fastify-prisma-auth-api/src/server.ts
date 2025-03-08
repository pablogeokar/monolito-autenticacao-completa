import { fastify } from "fastify";
import { fastifyEnv } from "@fastify/env";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { type EnvConfig, fastifyEnvOptions } from "./config/env.config";
import { getCorsOptions } from "./config/cors.config";
import prismaPlugin from "./plugins/prisma";
import { registerRoutes } from "./utils/register-routes";
import { printRoutes } from "./utils/print-routes";

const start = async () => {
  try {
    const app = fastify({
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
    }).withTypeProvider<ZodTypeProvider>();

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    // Registra o plugin @fastify/env com nossas configurações
    await app.register(fastifyEnv, fastifyEnvOptions);

    // registra o prisma como plugin, visando o correto gerenciamento das instâncias do prisma
    await app.register(prismaPlugin);

    // Usa a tipagem para garantir acesso seguro aos valores
    const config = app.config as EnvConfig;

    // Obtém as opções do CORS baseadas na configuração
    const corsOptions = getCorsOptions(config);

    // Registra o plugin de CORS com as opções definidas no arquivo de configuração
    await app.register(fastifyCors, corsOptions);

    // Ajusta o logger baseado no ambiente
    if (config.NODE_ENV !== "development") {
      app.log.level = "warn";
    }

    app.register(fastifySwagger, {
      openapi: {
        info: {
          title: "API Docs",
          version: "1.0.0",
        },
      },
      transform: jsonSchemaTransform,
    });

    app.register(fastifySwaggerUi, {
      routePrefix: "/docs",
    });

    // Registra todas as rotas automaticamente
    await registerRoutes(app);

    // Exibe todas as rotas registradas formatadas
    app.ready(() => {
      printRoutes();
    });

    // Inicia o servidor
    await app.listen({ port: config.PORT, host: "0.0.0.0" });
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
