import type { FastifyInstance } from "fastify";
import { userController } from "./user.module";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await userController.getUserById(id);
    return user || reply.status(404).send({ message: "User not found" });
  });

  fastify.post("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await userController.getUserById(id);
    return user || reply.status(404).send({ message: "User not found" });
  });
}
