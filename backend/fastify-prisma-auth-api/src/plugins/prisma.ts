import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export default fp(async (app: FastifyInstance) => {
  app.decorate("prisma", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});
