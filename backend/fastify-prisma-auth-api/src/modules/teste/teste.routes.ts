import type { FastifyInstance } from "fastify";

export default async function routes(app: FastifyInstance) {
  app.get("/", async (req, res) => {
    return res.send({ message: "Rota Teste" });
  });
}
