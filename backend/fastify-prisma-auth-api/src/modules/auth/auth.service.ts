import { prismaService } from "modules/prisma/prisma.module";
import type { CreateAuthDto, LoginInput, UpdateAuthDto } from "./auth.schema";
import bcrypt from "bcryptjs";
import type { FastifyInstance } from "fastify/fastify";

export class AuthService {
  constructor(private readonly app: FastifyInstance) {}
  async validateUser(email: string, password: string) {
    const user = await prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Credenciais inválidas");
    }

    return user;
  }

  async login({ email, password }: LoginInput) {
    const user = await this.validateUser(email, password);

    const accessToken = this.app.jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      { expiresIn: "15m" }
    );

    const refreshToken = this.app.jwt.sign(
      {
        id: user.id,
        email: user.email,
        version: user.tokenVersion,
      },
      { expiresIn: "7d" }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
  /**
   * Obtém todos os auths
   */
  getAll() {
    return console.log("chamou service getAll()");
  }

  /**
   * Obtém um auth pelo ID
   */
  getById(id: string) {
    return console.log("chamou service getById(id)");
  }

  /**
   * Cria um novo auth
   */
  create(data: CreateAuthDto) {
    return console.log("chamou service create(data)");
  }

  /**
   * Atualiza um auth existente
   */
  update(id: string, data: UpdateAuthDto) {
    return console.log("chamou service update(id, data)");
  }

  /**
   * Remove um auth
   */
  delete(id: string) {
    return console.log("chamou service delete(id)");
  }
}
