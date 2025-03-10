import { z } from "zod";

/**
 * Schema para auth
 */
export const loginSchema = {
  body: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  }),
};
export type LoginInput = z.infer<typeof loginSchema.body>;

export const authSchema = z.object({
  id: z.string().uuid().describe("ID único do auth"),
  name: z.string().min(3).describe("Nome do auth"),
  description: z.string().optional().describe("Descrição do auth"),
  createdAt: z.date().describe("Data de criação"),
  updatedAt: z.date().describe("Data de atualização"),
});

/**
 * Schema para criação de auth
 */
export const createAuthSchema = authSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema para atualização de auth
 */
export const updateAuthSchema = createAuthSchema.partial();

/**
 * Schema para resposta de auth
 */
export const authResponseSchema = authSchema;

/**
 * Schema para listagem de auths
 */
export const authListSchema = z.array(authResponseSchema);

/**
 * Schema para mensagens de erro
 */
export const errorResponseSchema = z.object({
  message: z.string().describe("Mensagem de erro"),
});

// Tipos exportados para uso em outros arquivos
export type Auth = z.infer<typeof authSchema>;
export type CreateAuthDto = z.infer<typeof createAuthSchema>;
export type UpdateAuthDto = z.infer<typeof updateAuthSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
