import { prismaService } from "../prisma/prisma.module";
import type { CreateDto } from "./user.schema";
import bcrypt from "bcryptjs";

export class UserService {
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
}
