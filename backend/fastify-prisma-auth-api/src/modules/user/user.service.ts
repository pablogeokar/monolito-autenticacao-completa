import { prisma } from "../../lib/prisma";
import type { CreateDto } from "./user.schema";

export class UserService {
  public async create(user: CreateDto) {
    return await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  public async getAll() {
    return await prisma.user.findMany();
  }

  public async getById(userId: string) {
    return await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
  }
}
