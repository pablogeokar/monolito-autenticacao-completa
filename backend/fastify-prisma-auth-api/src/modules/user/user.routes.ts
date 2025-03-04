import type { FastifyInstance } from "fastify";
import { userController } from "./user.module";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/users/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await userController.getUserById(id);
    return user || reply.status(404).send({ message: "User not found" });
  });
}
