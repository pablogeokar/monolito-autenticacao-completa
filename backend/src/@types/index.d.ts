import { FastifyRequest } from "fastify";
import type { UserDocument } from "../modules/database/models/user.model";

declare module "fastify" {
  interface FastifyRequest {
    sessionId?: string;
  }

  interface FastifyRequest {
    user?: UserDocument;
  }
}

declare module "@fastify/passport" {
  interface Authenticator {
    user: UserDocument;
  }
}

declare module "fastify" {
  interface Session {
    passport?: {
      user?: UserDocument;
    };
  }
}

// import { Request } from "express";
// import type { UserDocument } from "../modules/database/models/user.model";

// declare global {
//   namespace Express {
//     interface User extends UserDocument {}
//     interface Request {
//       sessionId?: string;
//     }
//   }
// }
