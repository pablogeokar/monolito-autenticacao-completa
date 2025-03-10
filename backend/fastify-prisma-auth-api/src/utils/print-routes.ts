import path from "node:path";
import fs from "node:fs";

export async function printRoutes() {
  const modulesPath = path.join(__dirname, "../modules");

  // Encontra todos os arquivos *.routes.ts
  const routeFiles = fs.readdirSync(modulesPath).flatMap((dir) => {
    const dirPath = path.join(modulesPath, dir);
    return fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith(".routes.ts"))
      .map((file) => path.join(dirPath, file));
  });

  console.log("\n📋 Rotas registradas:");
  console.log("=======================================================");

  // Para cada arquivo de rotas, extrai e exibe as rotas
  for (const routeFile of routeFiles) {
    try {
      // Obtém o prefixo da rota baseado no nome do arquivo
      const routePrefix = path.basename(routeFile, ".routes.ts");

      // Lê o conteúdo do arquivo
      const fileContent = fs.readFileSync(routeFile, "utf-8");

      // Extrai todas as definições de rotas usando regex
      // Procura por padrões como: app.get("...", ...), app.post("...", ...), etc.
      const routeRegex =
        /app\.(get|post|put|delete|patch|options|head)\s*\(\s*["'`]([^"'`]+)["'`]/g;

      // Define o tipo para match
      let match: RegExpExecArray | null;
      const routes: Array<{ method: string; path: string }> = [];

      // Coleta todas as rotas encontradas
      match = routeRegex.exec(fileContent);
      while (match !== null) {
        const method = match[1].toUpperCase();
        const routePath = match[2];
        routes.push({ method, path: routePath });
        match = routeRegex.exec(fileContent);
      }

      if (routes.length > 0) {
        console.log(`\n🔹 Módulo: ${routePrefix}`);

        // Exibe cada rota encontrada
        for (const route of routes) {
          // Formata o caminho completo da rota (prefixo + caminho)
          const fullPath = `/${routePrefix}${route.path}`;

          // Formata o método HTTP com cores (se disponível no terminal)
          let methodFormatted: string;
          switch (route.method) {
            case "GET":
              methodFormatted = "\x1b[46;97mGET\x1b[0m"; // Cyan
              break;
            case "POST":
              methodFormatted = "\x1b[42;97mPOST\x1b[0m"; // Verde
              break;
            case "PUT":
              methodFormatted = "\x1b[43;97mPUT\x1b[0m"; // Amarelo
              break;
            case "DELETE":
              methodFormatted = "\x1b[41;97mDELETE\x1b[0m"; // Vermelho
              break;
            case "PATCH":
              methodFormatted = "\x1b[35mPATCH\x1b[0m"; // Magenta
              break;
            default:
              methodFormatted = route.method;
          }

          // Exibe o método e o caminho
          console.log(`   ${methodFormatted.padEnd(10)} ${fullPath}`);
        }
      }
    } catch (error) {
      console.error(`Erro ao processar arquivo ${routeFile}:`, error);
    }
  }

  console.log("=======================================================");
}
