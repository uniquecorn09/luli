import Fastify from "fastify";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import jwtPlugin from "./plugins/jwt";
import authRoutes from "./routes/auth";
import adminOnlyPlugin from "./plugins/adminOnly";
import productsRoute from "./routes/products";
import wishlistRoutes from "./routes/wishlist";
import ownedRoutes from "./routes/owned";
import settingsRoutes from "./routes/settings";

// Load environment variables from .env (if present)
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/luli";

async function startServer() {
  const app = Fastify({ logger: true });

  // Lokales Array für die Route-Infos
  const routes: { method: string | string[]; url: string }[] = [];
  app.addHook("onRoute", (routeOptions) => {
    routes.push({ method: routeOptions.method, url: routeOptions.url });
  });

  // Health check route
  app.get("/health", async () => {
    return { status: "ok" };
  });

  // Register plugins
  app.register(jwtPlugin);
  app.register(adminOnlyPlugin);

  // Register routes
  app.register(authRoutes, { prefix: "/auth" });
  app.register(productsRoute);
  app.register(wishlistRoutes);
  app.register(ownedRoutes);
  app.register(settingsRoutes);

  // Connect to MongoDB
  try {
    await mongoose.connect(MONGO_URI);
    app.log.info("Connected to MongoDB");
  } catch (err) {
    app.log.error("Failed to connect to MongoDB");
    app.log.error(err);
    process.exit(1);
  }

  // Logge alle registrierten Routen nach app.ready()
  await app.ready();
  console.log("=== Registered Routes ===");
  routes.forEach((r) => {
    if (Array.isArray(r.method)) {
      r.method.forEach((m) => console.log(`${m} ${r.url}`));
    } else {
      console.log(`${r.method} ${r.url}`);
    }
  });
  console.log("========================");

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    app.log.info(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();
