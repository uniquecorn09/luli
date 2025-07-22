import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Fastify from "fastify";
import jwtPlugin from "../src/plugins/jwt";
import adminOnlyPlugin from "../src/plugins/adminOnly";
import productsRoute from "../src/routes/products";
import wishlistRoutes from "../src/routes/wishlist";

// Increase timeout for downloading Mongo binaries
jest.setTimeout(30000);

export const buildTestApp = async () => {
  const app = Fastify();
  app.register(jwtPlugin);
  app.register(adminOnlyPlugin);
  app.register(productsRoute);
  app.register(wishlistRoutes);
  await app.ready();
  return app;
};

let mongo: MongoMemoryServer | undefined;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
