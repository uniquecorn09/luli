import { FastifyPluginAsync } from "fastify";
import { importFeed } from "../services/feedImporter";
import * as dotenv from "dotenv";
dotenv.config();

interface UpdateFeedBody {
  feedUrl?: string;
}

const settingsRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: UpdateFeedBody }>(
    "/settings/update-feed",
    async (request) => {
      console.log(process.env.FEED_URL);
      const feedUrl = request.body.feedUrl || process.env.FEED_URL;
      if (!feedUrl) return { error: "feedUrl missing" };
      const count = await importFeed(feedUrl);
      return { status: "feed_updated", count };
    }
  );

  // SSE-Endpoint für Feed-Import-Status
  app.get("/settings/update-feed-stream", async (request, reply) => {
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.flushHeaders();

    const feedUrl = process.env.FEED_URL;
    if (!feedUrl) {
      reply.raw.write(
        `data: ${JSON.stringify({ error: "feedUrl missing" })}\n\n`
      );
      reply.raw.end();
      return;
    }

    let page = 1;
    let upserted = 0;
    const limit = 100;
    const axios = require("axios");
    const ProductModel = require("../models/product").default;

    while (true) {
      const url = `${feedUrl}${feedUrl.includes("?") ? "&" : "?"}limit=${limit}&page=${page}`;
      const { data } = await axios.get(url);
      if (!Array.isArray(data) || data.length === 0) break;
      let batchUpserted = 0;
      for (const p of data) {
        const tonieId = p.sku || p.sales_id || p.id || p.gtin || p.sku || "";
        if (!tonieId) continue;
        const productUrl = p.link || p.url || "";
        if (!productUrl.startsWith("https://tonies.com/de-de/tonies/"))
          continue;
        const existing = await ProductModel.findOne({ tonieId });
        if (existing) continue;
        await ProductModel.updateOne(
          { tonieId },
          {
            $set: {
              name: p.title || p.name || "",
              imageUrl: p.imageLink || p.image || "",
              productUrl,
              availability:
                p.availability === "in stock"
                  ? "in_stock"
                  : p.availability === "out of stock"
                    ? "out_of_stock"
                    : "unknown",
              price: p.salePrice && p.salePrice !== "" ? p.salePrice : p.price,
              lastSyncedAt: new Date(),
            },
          },
          { upsert: true }
        );
        upserted++;
        batchUpserted++;
      }
      reply.raw.write(
        `data: ${JSON.stringify({ page, batchUpserted, upserted })}\n\n`
      );
      if (data.length < limit) break;
      page++;
    }
    reply.raw.write(`data: ${JSON.stringify({ done: true, upserted })}\n\n`);
    reply.raw.end();
  });
};

export default settingsRoutes;
