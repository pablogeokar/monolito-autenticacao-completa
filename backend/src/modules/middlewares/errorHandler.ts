import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.error(`Error occurred on PATH: ${request.url}`, error);

  if (error.code === "FST_ERR_CTP_EMPTY_JSON_BODY") {
    return reply.status(400).send({
      message: "Invalid JSON format, please check your request body.",
    });
  }

  if (error instanceof SyntaxError) {
    return reply.status(400).send({
      message: "Invalid JSON format, please check your request body.",
    });
  }

  return reply.status(500).send({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occurred",
  });
};
