import { FastifyPluginAsync } from "fastify";
import { OwnedItemModel, ProductModel } from "../models";

interface AddRemoveBody {
  action: "add" | "remove";
}

const ownedRoutes: FastifyPluginAsync = async (app) => {
  // Get owned list
  app.get("/owned", async () => {
    const items = await OwnedItemModel.find().populate("product").lean();
    return items;
  });

  // Admin add/remove owned item
  app.post<{ Params: { tonieId: string }; Body: AddRemoveBody }>(
    "/owned/:tonieId",
    { preHandler: [app.authenticate, app.adminOnly] },
    async (request, reply) => {
      const { tonieId } = request.params;
      const { action } = request.body;
      const product = await ProductModel.findOne({ tonieId });
      if (!product) return reply.code(404).send({ error: "Product not found" });

      if (action === "add") {
        await OwnedItemModel.updateOne(
          { product: product._id },
          { $setOnInsert: { acquiredAt: new Date() } },
          { upsert: true }
        );
        return { status: "added" };
      }
      if (action === "remove") {
        await OwnedItemModel.deleteOne({ product: product._id });
        return { status: "removed" };
      }
      return reply.code(400).send({ error: "Invalid action" });
    }
  );
};

export default ownedRoutes;
