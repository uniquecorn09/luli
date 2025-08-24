import { FastifyPluginAsync } from "fastify";
import bcrypt from "bcryptjs";
import { UserModel } from "../models";

interface LoginBody {
  email: string;
  password: string;
}

const authRoutes: FastifyPluginAsync = async (app) => {
  // TODO: Auth-Routen sichern - JWT Middleware hinzufügen
  app.post<{ Body: LoginBody }>(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await UserModel.findOne({ email }).select("+password");
      console.log(password);
      console.log(user?.password);
      if (!user) {
        return reply.code(401).send({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, (user as any).password);
      if (!valid) {
        return reply.code(401).send({ error: "Invalid credentials" });
      }

      const accessToken = app.jwt.sign({
        sub: String(user._id),
        role: user.role,
      });

      return reply.send({ accessToken });
    }
  );
};

export default authRoutes;
