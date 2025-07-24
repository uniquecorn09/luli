import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyPluginAsync } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}

const jwtPlugin: FastifyPluginAsync = fp(async (app) => {
  app.register(jwt, {
    secret: process.env.JWT_SECRET || "change_this_secret",
  });

  // Authentication decorator
  app.decorate("authenticate", async function (request: any, reply: any) {
    // Authentifizierung deaktiviert
    return;
  });
});

export default jwtPlugin;
