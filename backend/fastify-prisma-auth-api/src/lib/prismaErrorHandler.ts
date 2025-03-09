import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { Prisma } from "@prisma/client";

export default fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error, request, reply) => {
    // Verifica se é um erro de conexão com o banco de dados
    if (
      // biome-ignore lint/complexity/useOptionalChain: <explanation>
      error.message &&
      error.message.includes("Can't reach database server")
    ) {
      return reply.status(503).send({
        code: "DATABASE_CONNECTION_ERROR",
        message: "Não foi possível conectar ao banco de dados",
      });
    }

    // Verifica se é um erro de serialização de resposta
    if (error.code === "FST_ERR_RESPONSE_SERIALIZATION") {
      return reply.status(422).send({
        code: "ERR_RESPONSE_SERIALIZATION",
        message: "Dados retornados incompatíveis com a serialização",
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Erros conhecidos do Prisma
      switch (error.code) {
        case "P2002":
          return reply.status(409).send({
            code: "CONFLICT",
            message: "Registro duplicado",
            //details: error.meta,
          });

        case "P2025":
          return reply.status(404).send({
            code: "NOT_FOUND",
            message: "Registro não encontrado",
            //details: error.meta,
          });

        default:
          return reply.status(400).send({
            code: "BAD_REQUEST",
            message: "Erro no banco de dados",
            // details: {
            //   code: error.code,
            //   meta: error.meta,
            // },
          });
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return reply.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Dados inválidos, verifique a formatação",
        //details: error.message,
      });
    }

    // Repassa outros erros para o handler padrão
    reply.send(error);
  });
});
