import { prismaService } from "../prisma/prisma.module";
import type { CreateDto, UpdateDto } from "./user.schema";
import bcrypt from "bcryptjs";

export class UserService {
  /**
   * Cria um novo usuário
   */
  public async create(user: CreateDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return await prismaService.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Retorna todos os usuários
   */
  public async getAll() {
    return await prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Busca um usuário pelo ID
   */
  public async getById(userId: string) {
    return await prismaService.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Atualiza um usuário existente
   */
  public async update(userId: string, data: UpdateDto) {
    // Se a senha for fornecida, faz o hash
    const updateData = {
      ...data,
      ...(data.password && {
        password: await bcrypt.hash(data.password, 10),
      }),
    };

    return await prismaService.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Remove um usuário pelo ID
   */
  public async remove(userId: string) {
    return await prismaService.user.delete({
      where: {
        id: userId,
      },
    });
  }

  /**
   * Busca um usuário pelo email
   */
  public async getByEmail(email: string) {
    return await prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
