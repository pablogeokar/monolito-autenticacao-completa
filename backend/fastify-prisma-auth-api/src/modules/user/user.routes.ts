import { z } from "zod";
import type { FastifyTypedInstance } from "types";
import { userService } from "./user.module";
import {
  listSchema,
  simpleResponseSchema,
  createSchema,
  updateSchema,
  errorResponseSchema,
  validationErrorSchema,
  type CreateDto,
  type UpdateDto,
} from "./user.schema";

export default async function routes(app: FastifyTypedInstance) {
  // Lista todos os usuários
  app.get(
    "/",
    {
      schema: {
        description: "Lista todos os usuários cadastrados",
        tags: ["users"],
        response: {
          200: listSchema.describe("Lista de usuários"),
        },
      },
    },
    async () => {
      const users = await userService.getAll();
      return users;
    }
  );

  // Busca um usuário pelo ID
  app.get(
    "/:id",
    {
      schema: {
        description: "Busca um usuário pelo ID",
        tags: ["users"],
        params: z.object({
          id: z.string().uuid().describe("ID do usuário"),
        }),
        response: {
          200: simpleResponseSchema.describe("Usuário encontrado"),
          404: errorResponseSchema.describe("Usuário não encontrado"),
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params as { id: string };
      const user = await userService.getById(id);

      if (!user) {
        return reply.status(404).send({
          message: "Usuário não encontrado",
          code: "USER_NOT_FOUND",
        });
      }

      return user;
    }
  );

  // Cria um novo usuário
  app.post(
    "/",
    {
      schema: {
        description: "Cria um novo usuário",
        tags: ["users"],
        body: createSchema,
        response: {
          201: simpleResponseSchema.describe("Usuário criado com sucesso"),
          400: validationErrorSchema.describe("Erro de validação"),
          409: errorResponseSchema.describe("Email já cadastrado"),
          500: errorResponseSchema.describe("Erro interno do servidor"),
        },
      },
    },
    async (req, reply) => {
      try {
        const userData = req.body as CreateDto;
        const user = await userService.create(userData);

        return reply.status(201).send(user);
      } catch (error) {
        if (error instanceof Error) {
          // Verificar se é um erro de email duplicado
          if (
            error.message.includes(
              "Unique constraint failed on the fields: (`email`)"
            )
          ) {
            return reply.status(409).send({
              message: "Email já cadastrado",
              code: "EMAIL_ALREADY_EXISTS",
            });
          }

          // Outros erros
          return reply.status(500).send({
            message: "Erro ao criar usuário",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return reply.status(500).send({
          message: "Erro desconhecido",
          code: "UNKNOWN_ERROR",
        });
      }
    }
  );

  // Atualiza um usuário existente
  app.put(
    "/:id",
    {
      schema: {
        description: "Atualiza um usuário existente",
        tags: ["users"],
        params: z.object({
          id: z.string().uuid().describe("ID do usuário"),
        }),
        body: updateSchema,
        response: {
          200: simpleResponseSchema.describe("Usuário atualizado com sucesso"),
          400: validationErrorSchema.describe("Erro de validação"),
          404: errorResponseSchema.describe("Usuário não encontrado"),
          409: errorResponseSchema.describe("Email já cadastrado"),
          500: errorResponseSchema.describe("Erro interno do servidor"),
        },
      },
    },
    async (req, reply) => {
      try {
        const { id } = req.params as { id: string };
        const updateData = req.body as UpdateDto;

        // Verificar se o usuário existe
        const existingUser = await userService.getById(id);
        if (!existingUser) {
          return reply.status(404).send({
            message: "Usuário não encontrado",
            code: "USER_NOT_FOUND",
          });
        }

        // Atualizar o usuário
        const updatedUser = await userService.update(id, updateData);
        return updatedUser;
      } catch (error) {
        if (error instanceof Error) {
          // Verificar se é um erro de email duplicado
          if (
            error.message.includes(
              "Unique constraint failed on the fields: (`email`)"
            )
          ) {
            return reply.status(409).send({
              message: "Email já cadastrado",
              code: "EMAIL_ALREADY_EXISTS",
            });
          }

          // Outros erros
          return reply.status(500).send({
            message: "Erro ao atualizar usuário",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return reply.status(500).send({
          message: "Erro desconhecido",
          code: "UNKNOWN_ERROR",
        });
      }
    }
  );

  // Remove um usuário
  app.delete(
    "/:id",
    {
      schema: {
        description: "Remove um usuário",
        tags: ["users"],
        params: z.object({
          id: z.string().uuid().describe("ID do usuário"),
        }),
        response: {
          204: z.null().describe("Usuário removido com sucesso"),
          404: errorResponseSchema.describe("Usuário não encontrado"),
          500: errorResponseSchema.describe("Erro interno do servidor"),
        },
      },
    },
    async (req, reply) => {
      try {
        const { id } = req.params as { id: string };

        // Verificar se o usuário existe
        const existingUser = await userService.getById(id);
        if (!existingUser) {
          return reply.status(404).send({
            message: "Usuário não encontrado",
            code: "USER_NOT_FOUND",
          });
        }

        // Remover o usuário
        await userService.remove(id);
        return reply.status(204).send();
      } catch (error) {
        return reply.status(500).send({
          message: "Erro ao remover usuário",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  );
}
