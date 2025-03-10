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
import { registerRoutes } from "./utils/register-routes";
import { printRoutes } from "./utils/print-routes";
import { prismaPlugin } from "./modules/prisma/prisma.plugin";
import { authPlugin } from "./modules/auth/auth.plugin";
import prismaErrorHandler from "./lib/prismaErrorHandler";

const createLogger = () => {
  return {
    level: "info",
    timestamp: true,
    formatters: {
      level: (label: string) => ({ level: label.toUpperCase() }),
    },
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname,reqId",
      },
    },
  };
};

const start = async () => {
  try {
    const app = fastify({
      logger: createLogger(),
    }).withTypeProvider<ZodTypeProvider>();

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    await app.register(fastifyEnv, fastifyEnvOptions);
    await app.register(prismaPlugin);
    await app.register(prismaErrorHandler);

    const config = app.config as EnvConfig;
    const corsOptions = getCorsOptions(config);
    await app.register(fastifyCors, corsOptions);

    if (config.NODE_ENV !== "development") {
      app.log.level = "debug";
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

    await app.register(authPlugin);
    await registerRoutes(app);

    app.ready(() => {
      printRoutes();
    });

    await app.listen({ port: config.PORT, host: "0.0.0.0" });
    console.log(
      `🚀 Servidor rodando na porta ${config.PORT} em modo ${config.NODE_ENV}`
    );
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
};

start();
