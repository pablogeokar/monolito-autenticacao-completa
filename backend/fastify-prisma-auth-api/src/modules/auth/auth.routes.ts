import type { FastifyTypedInstance } from "../../types";
import { getAuthService } from "./auth.module";
import { loginSchema } from "./auth.schema";

export default async function routes(app: FastifyTypedInstance) {
  app.post(
    "/login",
    {
      schema: {
        description: "Faz login no sistema",
        tags: ["auth"],
        ...loginSchema,
      },
    },
    async (req, res) => {
      try {
        const data = req.body;

        // Obter a instância do serviço
        const authService = getAuthService();

        // Realizar o login
        const result = await authService.login(data);

        // Definir o cookie para o refreshToken
        // Verificar se o método exists
        if (typeof res.setCookie === "function") {
          res.setCookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
          });
        } else if (typeof res.cookie === "function") {
          res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
          });
        } else {
          // Se não encontrar nenhum método de cookie, registrar aviso
          req.log.warn(
            "Método de cookie não encontrado - continuando sem definir cookie"
          );
        }

        // Retornar os tokens na resposta
        return result;
      } catch (error) {
        req.log.error(error);
        return res.status(401).send({
          error: "Falha na autenticação",
          message: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }
  );

  // app.post(
  //   "/login",
  //   {
  //     schema: {
  //       description: "Faz login no sistema",
  //       tags: ["auth"],
  //       ...loginSchema,
  //     },
  //   },
  //   async (req, res) => {
  //     try {
  //       const data = req.body;

  //       // Obter a instância do serviço diretamente do app
  //       const authService = getAuthService();
  //       console.log("AuthService obtido com sucesso:", !!authService);

  //       // Chamar o método login e imprimir algumas informações de debug
  //       const result = await authService.login(data);
  //       console.log("Login bem-sucedido:", !!result);

  //       // Retornar os tokens na resposta
  //       return result;
  //     } catch (error) {
  //       console.error("Erro durante o login:", error);
  //       return res.status(401).send({
  //         error: "Falha na autenticação",
  //         message: error instanceof Error ? error.message : "Erro desconhecido",
  //       });
  //     }
  //   }
  // );
}
