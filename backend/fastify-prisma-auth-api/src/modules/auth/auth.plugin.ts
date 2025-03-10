import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import type { EnvConfig } from "../../config/env.config";
import { initAuthModule } from "./auth.module";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

export async function authPlugin(app: FastifyInstance) {
  const config = app.config as EnvConfig;

  // Registre o plugin JWT
  await app.register(fastifyJwt, {
    secret: config.JWT_SECRET,
    sign: {
      expiresIn: "15m",
    },
    verify: {
      cache: true,
    },
  });

  // Registre o plugin de cookies separadamente e certificando-se de que é registrado
  await app.register(fastifyCookie, {
    secret: config.COOKIE_SECRET,
    hook: "onRequest",
  });

  app.decorate(
    "authenticate",
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        res.code(401).send({
          error: "Não autorizado",
          message: err instanceof Error ? err.message : "Token inválido",
        });
      }
    }
  );

  // Inicializa o serviço de autenticação com a instância do Fastify
  initAuthModule(app);
}

// import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
// import fastifyJwt from "@fastify/jwt";
// import fastifyCookie from "@fastify/cookie";
// import type { EnvConfig } from "../../config/env.config";

// declare module "@fastify/jwt" {
//   interface FastifyJWT {
//     user: {
//       id: string;
//       email: string;
//     };
//   }
// }

// // No auth.plugin.ts
// import { initAuthModule } from "./auth.module";

// export async function authPlugin(app: FastifyInstance) {
//   const config = app.config as EnvConfig;
//   await app.register(fastifyJwt, {
//     secret: config.JWT_SECRET,
//     sign: {
//       expiresIn: "15m",
//     },
//     verify: {
//       cache: true,
//     },
//   });

//   await app.register(fastifyCookie, {
//     secret: config.COOKIE_SECRET,
//     hook: "onRequest",
//     parseOptions: {},
//   });

//   app.decorate(
//     "authenticate",
//     async (req: FastifyRequest, res: FastifyReply) => {
//       try {
//         await req.jwtVerify();
//       } catch (err) {
//         res.code(401).send({
//           error: "Não autorizado",
//           message: err instanceof Error ? err.message : "Token inválido",
//         });
//       }
//     }
//   );

//   // Inicializa o serviço de autenticação com a instância do Fastify
//   initAuthModule(app);
// }
