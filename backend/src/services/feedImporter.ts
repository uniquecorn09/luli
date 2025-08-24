import axios from "axios";
import ProductModel from "../models/product";

export interface FeedProduct {
  tonieId: string;
  name: string;
  imageUrl?: string;
  productUrl?: string;
  availability?: "in_stock" | "out_of_stock" | "unknown";
  price?: number | string;
}

export async function importFeed(
  feedUrl: string,
  limit = 100
): Promise<number> {
  let page = 1;
  let upserted = 0;
  let totalFetched = 0;
  while (true) {
    const url = `${feedUrl}${feedUrl.includes("?") ? "&" : "?"}limit=${limit}&page=${page}`;
    console.log(`Requesting: ${url}`);
    const { data } = await axios.get(url);
    if (!Array.isArray(data) || data.length === 0) break;
    totalFetched += data.length;
    for (const p of data) {
      const tonieId = p.sku || p.sales_id || p.id || p.gtin || p.sku || "";
      if (!tonieId) continue;
      const productUrl = p.link || p.url || "";
      if (!productUrl.startsWith("https://tonies.com/de-de/tonies/")) continue;
      const existing = await ProductModel.findOne({ tonieId });
      if (existing) continue; // Produkt existiert schon, überspringen
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
    }
    console.log(
      `Fetched batch: page=${page}, batchSize=${data.length}, totalUpserted=${upserted}`
    );
    if (data.length < limit) break;
    page++;
  }
  return upserted;
}
