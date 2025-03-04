import type { FastifyInstance } from "fastify";

export default async function testeRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    return reply.send({ message: "Rota teste funcionando" });
  });
}
