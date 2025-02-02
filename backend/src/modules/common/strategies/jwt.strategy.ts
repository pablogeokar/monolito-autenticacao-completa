import type { FastifyInstance } from "fastify";
import fastifyPassport from "@fastify/passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  type StrategyOptionsWithRequest,
} from "passport-jwt";
import { UnauthorizedException } from "../utils/catch-errors";
import { ErrorCode } from "../enums/error-code.enum";
import { config } from "../../config/app.config";
import { userService } from "../../user/user.module";

interface JwtPayload {
  userId: string;
  sessionId: string;
}

const options: StrategyOptionsWithRequest = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new UnauthorizedException(
          "Unauthorized access token",
          ErrorCode.AUTH_TOKEN_NOT_FOUND
        );
      }

      return accessToken;
    },
  ]),
  secretOrKey: config.JWT.SECRET,
  audience: ["user"],
  algorithms: ["HS256"],
  passReqToCallback: true,
};

export const setupJwtStrategy = (fastify: FastifyInstance) => {
  fastify.register(fastifyPassport.initialize());

  fastifyPassport.use(
    "jwt",
    new JwtStrategy(options, async (req, payload: JwtPayload, done) => {
      try {
        const user = await userService.findUserById(payload.userId);
        if (!user) {
          return done(null, false);
        }

        req.sessionId = payload.sessionId;
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );

  // Registra a serialização do usuário
  fastifyPassport.registerUserSerializer(async (user) => user);
  fastifyPassport.registerUserDeserializer(async (user) => user);

  return fastifyPassport;
};

// import type { PassportStatic } from "passport";
// import {
//   ExtractJwt,
//   type VerifiedCallback,
//   type StrategyOptionsWithRequest,
// } from "passport-jwt";
// import { Strategy as JwtStrategy } from "passport-jwt";
// import { UnauthorizedException } from "../utils/catch-errors";
// import { ErrorCode } from "../enums/error-code.enum";
// import { config } from "../../config/app.config";
// import { userService } from "../../user/user.module";
// import type { FastifyRequest } from "fastify";

// interface JwtPayload {
//   userId: string;
//   sessionId: string;
// }

// const options: StrategyOptionsWithRequest = {
//   jwtFromRequest: ExtractJwt.fromExtractors([
//     (req) => {
//       const accessToken = req.cookies.accessToken;

//       if (!accessToken) {
//         throw new UnauthorizedException(
//           "Unauthorized access token",
//           ErrorCode.AUTH_TOKEN_NOT_FOUND
//         );
//       }

//       return accessToken;
//     },
//   ]),
//   secretOrKey: config.JWT.SECRET,
//   audience: ["user"],
//   algorithms: ["HS256"],
//   passReqToCallback: true,
// };

// export const setupJwtStrategy = (passport: PassportStatic) => {
//   passport.use(
//     new JwtStrategy(
//       options,
//       async (
//         req: FastifyRequest,
//         payload: JwtPayload,
//         done: VerifiedCallback
//       ) => {
//         try {
//           const user = await userService.findUserById(payload.userId);
//           if (!user) {
//             return done(null, false);
//           }
//           req.sessionId = payload.sessionId;
//           return done(null, user);
//         } catch (error) {
//           return done(error, false);
//         }
//       }
//     )
//   );
// };
