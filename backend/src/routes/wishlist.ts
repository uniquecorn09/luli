import { FastifyPluginAsync } from "fastify";
import { WishlistItemModel, ProductModel } from "../models";

interface AddRemoveBody {
  action: "add" | "remove";
}

const wishlistRoutes: FastifyPluginAsync = async (app) => {
  // Get wishlist
  app.get("/wishlist", async () => {
    const items = await WishlistItemModel.find().populate("product").lean();
    return items;
  });

  // Admin add/remove
  app.post<{ Params: { tonieId: string }; Body: AddRemoveBody }>(
    "/wishlist/:tonieId",
    {
      preHandler: [app.authenticate, app.adminOnly],
    },
    async (request, reply) => {
      const { tonieId } = request.params;
      const { action } = request.body;
      console.log("Looking for tonieId:", tonieId);
      const product = await ProductModel.findOne({ tonieId });
      console.log("Product found:", product);
      if (!product) return reply.code(404).send({ error: "Product not found" });

      if (action === "add") {
        await WishlistItemModel.updateOne(
          { product: product._id },
          { $setOnInsert: { addedAt: new Date() } },
          { upsert: true }
        );
        return { status: "added" };
      }
      if (action === "remove") {
        await WishlistItemModel.deleteOne({ product: product._id });
        return { status: "removed" };
      }
      return reply.code(400).send({ error: "Invalid action" });
    }
  );

  // Public propose to wishlist
  app.post<{ Params: { tonieId: string } }>(
    "/wishlist/propose/:tonieId",
    async (request, reply) => {
      const { tonieId } = request.params;
      const product = await ProductModel.findOne({ tonieId });
      if (!product) return reply.code(404).send({ error: "Product not found" });

      const existing = await WishlistItemModel.findOne({
        product: product._id,
      });
      if (existing) return { status: "already_in_wishlist" };

      await WishlistItemModel.create({ product: product._id });
      return { status: "proposed" };
    }
  );

  // Public mark purchased
  app.post<{ Params: { id: string } }>(
    "/mark-purchased/:id",
    async (request, reply) => {
      const { id } = request.params;
      const item = await WishlistItemModel.findById(id);
      if (!item)
        return reply.code(404).send({ error: "Wishlist item not found" });

      item.purchasedAt = new Date();
      await item.save();
      return { status: "marked_purchased" };
    }
  );
};

export default wishlistRoutes;
