import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../common/utils/app-error";

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.error(`Error occurred on PATH: ${request.url}`, error);

  if (error.code === "FST_ERR_CTP_EMPTY_JSON_BODY") {
    return reply.status(HTTPSTATUS.BAD_REQUEST).send({
      message: "Invalid JSON format, please check your request body.",
    });
  }

  if (error instanceof SyntaxError) {
    return reply.status(HTTPSTATUS.BAD_REQUEST).send({
      message: "Invalid JSON format, please check your request body.",
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return reply.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).send({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occurred",
  });
};
