import { FastifyPluginAsync } from "fastify";
import { OwnedItemModel, ProductModel, WishlistItemModel } from "../models";

interface AddRemoveBody {
  action: "add" | "remove";
  pending?: boolean;
}

const ownedRoutes: FastifyPluginAsync = async (app) => {
  // TODO: Auth-Middleware für geschützte Routen hinzufügen
  // Get owned list
  app.get("/owned", async () => {
    const items = await OwnedItemModel.find().populate("product").lean();
    // pending-Feld ist jetzt immer enthalten
    return items;
  });

  // Öffentlich: Als gekauft markieren (add)
  app.post<{ Params: { tonieId: string }; Body: AddRemoveBody }>(
    "/owned/:tonieId",
    async (request, reply) => {
      const { tonieId } = request.params;
      const { action } = request.body;
      const product = await ProductModel.findOne({ tonieId });
      if (!product) return reply.code(404).send({ error: "Product not found" });

      if (action === "add") {
        const pending =
          typeof request.body.pending === "boolean"
            ? request.body.pending
            : false;
        const result = await OwnedItemModel.findOneAndUpdate(
          { product: product._id },
          { $setOnInsert: { acquiredAt: new Date() }, pending },
          { upsert: true, new: true }
        )
          .populate("product")
          .lean();

        // Produkt aus der Wunschliste entfernen
        await WishlistItemModel.deleteOne({ product: product._id });

        return { status: "added", item: result };
      }
      // Für remove keine Authentifizierung mehr erforderlich
      if (action === "remove") {
        await OwnedItemModel.deleteOne({ product: product._id });
        return { status: "removed" };
      }
      return reply.code(400).send({ error: "Invalid action" });
    }
  );

  // Entfernen aus Besitz-Liste (nur für eingeloggte Nutzer)
  app.post<{ Params: { tonieId: string }; Body: AddRemoveBody }>(
    "/owned/:tonieId/remove",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { tonieId } = request.params;
      const product = await ProductModel.findOne({ tonieId });
      if (!product) return reply.code(404).send({ error: "Product not found" });
      await OwnedItemModel.deleteOne({ product: product._id });
      return { status: "removed" };
    }
  );

  // Set pending auf false (im Besitz)
  app.post<{ Params: { tonieId: string } }>(
    "/owned/:tonieId/set-pending",
    async (request, reply) => {
      const { tonieId } = request.params;
      const product = await ProductModel.findOne({ tonieId });
      if (!product) return reply.code(404).send({ error: "Product not found" });
      const result = await OwnedItemModel.findOneAndUpdate(
        { product: product._id },
        { pending: false },
        { new: true }
      )
        .populate("product")
        .lean();
      return { status: "updated", item: result };
    }
  );
};

export default ownedRoutes;
