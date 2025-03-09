import { prismaService } from "../prisma/prisma.module";
import type { CreateDto } from "./user.schema";

export class UserService {
  public async create(user: CreateDto) {
    return await prismaService.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  public async getAll() {
    return await prismaService.user.findMany();
  }

  public async getById(userId: string) {
    return await prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
  }
}
