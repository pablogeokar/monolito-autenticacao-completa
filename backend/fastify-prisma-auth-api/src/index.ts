import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import cors from "@fastify/cors";
import { type EnvConfig, fastifyEnvOptions } from "./config/env.config";
import { getCorsOptions } from "./config/cors.config";

const start = async () => {
  try {
    const fastify = Fastify({
      logger: true,
    });

    // Registra o plugin @fastify/env com nossas configurações
    await fastify.register(fastifyEnv, fastifyEnvOptions);

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

    // Define uma rota básica
    fastify.get("/", async () => {
      return { hello: "world" };
    });

    // Inicia o servidor
    await fastify.listen({ port: config.PORT, host: "0.0.0.0" });
    console.log(
      `🚀 Servidor rodando na porta ${config.PORT} em modo ${config.NODE_ENV}`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
