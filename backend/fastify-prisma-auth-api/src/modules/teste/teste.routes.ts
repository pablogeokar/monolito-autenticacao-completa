import type { FastifyInstance } from "fastify";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    return reply.send({ message: "Rota Teste" });
  });
}
