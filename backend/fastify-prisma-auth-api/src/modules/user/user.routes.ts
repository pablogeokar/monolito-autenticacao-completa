import { z } from "zod";
import type { FastifyTypedInstance } from "types";
import { userService } from "./user.module";
import {
  ListSchema,
  responseSchema,
  createSchema,
  errorResponseSchema,
  type CreateDto,
} from "./user.schema";

export default async function routes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      schema: {
        description: "Lista todos os usuários cadastrados",
        tags: ["users"],
        response: {
          200: ListSchema.describe("Lista de usuários"),
        },
      },
    },
    async () => {
      const users = await userService.getAll();
      return users;
    }
  );

  app.get(
    "/:id",
    {
      schema: {
        description: "Busca um usuário pelo ID",
        tags: ["users"],
        params: z.object({
          id: z.string().describe("ID do usuário"),
        }),
        response: {
          200: responseSchema.describe("Usuário encontrado"),
          404: errorResponseSchema.describe("Usuário não encontrado"),
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const user = await userService.getById(id);
      if (!user)
        return reply.status(404).send({ message: "Usuário não encontrado" });
      return user;
    }
  );

  app.post(
    "/",
    {
      schema: {
        description: "Cria um novo usuário",
        tags: ["users"],
        body: createSchema,
        response: {
          201: responseSchema.describe("Usuário criado com sucesso"),
          404: errorResponseSchema.describe("Erro ao criar usuário"),
        },
      },
    },
    async (req, res) => {
      const userData = req.body as CreateDto;
      const user = await userService.create(userData);
      if (!user) {
        return res.status(404).send({ message: "Erro ao criar usuário" });
      }
      return res.status(201).send(user);
    }
  );
}
