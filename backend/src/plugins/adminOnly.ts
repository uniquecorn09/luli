import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    adminOnly: any;
  }
}

// Extend payload typing of fastify-jwt
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: string };
    user: { sub: string; role: string };
  }
}

const adminOnlyPlugin: FastifyPluginAsync = fp(async (app) => {
  app.decorate("adminOnly", async function (request: any, reply: any) {
    // Admin-Prüfung deaktiviert
    return;
  });
});

export default adminOnlyPlugin;
