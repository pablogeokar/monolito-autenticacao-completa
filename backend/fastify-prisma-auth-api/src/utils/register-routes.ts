import path from "node:path";
import fs from "node:fs";
import type { FastifyInstance } from "fastify";

export async function registerRoutes(app: FastifyInstance) {
  const modulesPath = path.join(__dirname, "../modules");

  // Encontra todos os arquivos *.routes.ts
  const routeFiles = fs.readdirSync(modulesPath).flatMap((dir) => {
    const dirPath = path.join(modulesPath, dir);
    return fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith(".routes.ts"))
      .map((file) => path.join(dirPath, file));
  });

  // Registra cada arquivo de rotas encontrado
  for (const routeFile of routeFiles) {
    try {
      const routeModule = await import(routeFile);
      const routePrefix = path.basename(routeFile, ".routes.ts");

      // Cria um novo escopo Fastify com o prefixo
      app.register(
        async (app) => {
          if (typeof routeModule.default === "function") {
            await routeModule.default(app);
          } else if (typeof routeModule.registerRoute === "function") {
            await routeModule.registerRoute(app);
          } else {
            app.log.warn(
              `Arquivo de rotas ${routeFile} não exporta uma função válida`
            );
          }
        },
        { prefix: `/${routePrefix}` }
      );
    } catch (error) {
      app.log.error({
        message: `Erro ao registrar rotas de ${routeFile}`,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      });
    }
  }
}
