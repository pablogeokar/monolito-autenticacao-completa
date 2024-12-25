import type { FastifyReply, FastifyRequest } from "fastify";

type AsyncControllerType = (
  req: FastifyRequest,
  res: FastifyReply
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
) => Promise<any>;

export const asyncHandler =
  (controller: AsyncControllerType): AsyncControllerType =>
  async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await controller(req, res);
    } catch (error) {
      return error;
    }
  };
