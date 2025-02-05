import fastifyPassport from "@fastify/passport";
import type { FastifyInstance } from "fastify";
import { setupJwtStrategy } from "../common/strategies/jwt.strategy";
import flash from "@fastify/flash";
import secureSession from "@fastify/secure-session";

const initializePassport = async (fastify: FastifyInstance) => {
  // Configura secure session
  await fastify.register(secureSession, {
    secret: Buffer.from(
      "5d41402abc4b2a76b9719d911017c592f5d41402abc4b2a76b9719d911017c592",
      "hex"
    ),
    salt: "mq9hDxBVDbspDR6n",
    cookieName: "sessionId",
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  });

  // Registra flash após a sessão
  await fastify.register(flash);

  // Configura a estratégia JWT
  setupJwtStrategy(fastify);

  return fastifyPassport;
};

export { initializePassport };

// import passport from "passport";
// import { setupJwtStrategy } from "../common/strategies/jwt.strategy";

// const initializePassport = () => {
//   setupJwtStrategy(passport);
// };

// initializePassport();

// export default passport;
