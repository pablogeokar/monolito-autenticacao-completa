import fastifyPassport from "@fastify/passport";
import type { FastifyInstance } from "fastify";
import { setupJwtStrategy } from "../common/strategies/jwt.strategy";

const initializePassport = async (fastify: FastifyInstance) => {
  // Registra o inicializador do passport
  await fastify.register(fastifyPassport.initialize());

  // Se estiver usando sessões, descomente a linha abaixo
  // await fastify.register(fastifyPassport.secureSession());

  // Configura a estratégia JWT
  setupJwtStrategy(fastify);

  return fastifyPassport;
};

export { initializePassport };
export default fastifyPassport;

// import passport from "passport";
// import { setupJwtStrategy } from "../common/strategies/jwt.strategy";

// const initializePassport = () => {
//   setupJwtStrategy(passport);
// };

// initializePassport();

// export default passport;
