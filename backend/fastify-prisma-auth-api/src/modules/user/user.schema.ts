import { z } from "zod";

// Schema do usuário base
export const Schema = z.object({
  id: z.string().describe("ID único do usuário"),
  name: z.string().describe("Nome completo do usuário"),
  email: z.string().email().describe("Email válido do usuário"),
  password: z.string().describe("Senha do usuário"),
});

// Schema para criação de usuário (sem ID, que será gerado)
export const createSchema = Schema.omit({
  id: true,
});

// Schema para resposta de usuário (pode ser diferente do modelo interno)
export const responseSchema = z.object({
  id: z.string().describe("ID único do usuário"),
  name: z.string().describe("Nome completo do usuário"),
  email: z.string().describe("Email válido do usuário"),
  createdAt: z.date().describe("Data da criação"),
  updatedAt: z.date().describe("Data da última atualização"),
});

// Schema para listagem de usuários
export const ListSchema = z.array(responseSchema);

// Schema para mensagens de erro
export const errorResponseSchema = z.object({
  message: z.string().describe("Mensagem de erro"),
});

// Tipos exportados para uso em outros arquivos
export type User = z.infer<typeof Schema>;
export type CreateDto = z.infer<typeof createSchema>;
export type Response = z.infer<typeof responseSchema>;
