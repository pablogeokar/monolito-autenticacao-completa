import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../common/utils/app-error";
import { z } from "zod";
import {
  clearAuthenticationCookies,
  REFRESH_PATH,
} from "../common/utils/cookie";

function getPath(request: FastifyRequest) {
  const url = new URL(request.url, `http://${request.hostname}`);
  return url.pathname; // Retorna apenas o path, sem query string
}

const formatZodError = (res: FastifyReply, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return res.status(HTTPSTATUS.BAD_REQUEST).send({
    message: "Validation failed",
    errors,
  });
};

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.error(`Error occurred on PATH: ${request.url}`, error);

  const urlGetPath = getPath(request);

  if (urlGetPath === REFRESH_PATH) {
    clearAuthenticationCookies(reply);
  }

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

  if (error instanceof z.ZodError) {
    return formatZodError(reply, error);
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
