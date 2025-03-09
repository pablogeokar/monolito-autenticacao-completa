import { z } from "zod";

// Schemas base para validação de campos
const idSchema = z.string().uuid().describe("ID único do usuário");
const nameSchema = z
  .string()
  .min(3)
  .max(100)
  .describe("Nome completo do usuário");
const emailSchema = z.string().email().describe("Email válido do usuário");
const passwordSchema = z
  .string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "A senha deve conter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais",
  })
  .describe("Senha do usuário");
const tokenVersionSchema = z
  .number()
  .int()
  .nonnegative()
  .describe("Versão do token de autenticação");
const dateSchema = z.date().describe("Data");

// Schema para criação de usuário
export const createSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Schema para atualização de usuário (todos os campos são opcionais)
export const updateSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  });

// Schema para login de usuário
// export const loginSchema = z.object({
//   email: emailSchema,
//   password: z.string().describe("Senha do usuário"),
// });

// Schema para resposta simplificada (usado em listagens)
export const simpleResponseSchema = z.object({
  id: idSchema,
  name: nameSchema,
  email: emailSchema,
  createdAt: dateSchema.describe("Data da criação"),
  updatedAt: dateSchema.describe("Data da última atualização"),
});

// Schema para listagem de usuários
export const listSchema = z.array(simpleResponseSchema);

// Schemas para mensagens de erro
export const errorResponseSchema = z.object({
  message: z.string().describe("Mensagem de erro"),
  code: z.string().optional().describe("Código de erro"),
});

export const validationErrorSchema = z.object({
  message: z.string().describe("Mensagem de erro"),
  errors: z.array(
    z.object({
      field: z.string().describe("Campo com erro"),
      message: z.string().describe("Descrição do erro"),
    })
  ),
});

// Tipos exportados para uso em outros arquivos
export type CreateDto = z.infer<typeof createSchema>;
export type UpdateDto = z.infer<typeof updateSchema>;
//export type LoginDto = z.infer<typeof loginSchema>;
export type SimpleResponse = z.infer<typeof simpleResponseSchema>;
