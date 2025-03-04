import { prisma } from "../../lib/prisma";

export class UserService {
  public async findUserById(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    return user || null;
  }
}
