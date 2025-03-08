import { prisma } from "../../lib/prisma";

export class UserService {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public async create(user: any) {
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
