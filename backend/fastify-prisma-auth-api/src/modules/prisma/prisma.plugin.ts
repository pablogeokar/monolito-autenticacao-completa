import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { prismaService } from "./prisma.module";

export const prismaPlugin = fp(async (app: FastifyInstance) => {
  app.decorate("prisma", prismaService);

  app.addHook("onClose", async () => {
    await prismaService.$disconnect();
  });
});
