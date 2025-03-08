import type { FastifyInstance } from "fastify";
import { userController } from "./user.module";

export default async function routes(app: FastifyInstance) {
  app.get("/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const user = await userController.getUserById(id);
    return user || reply.status(404).send({ message: "User not found" });
  });

  app.post("/:id", async (req, res) => {
    const { id } = req.params as { id: string };
    const user = await userController.getUserById(id);
    return user || res.status(404).send({ message: "User not found" });
  });
}
