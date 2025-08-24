import { FastifyPluginAsync } from "fastify";
import ProductModel from "../models/product";

const productSchema = {
  $id: "Product",
  type: "object",
  properties: {
    _id: { type: "string" },
    tonieId: { type: "string" },
    name: { type: "string" },
    imageUrl: { type: "string" },
    productUrl: { type: "string" },
    availability: { type: "string" },
    price: {},
    lastSyncedAt: { type: "string", format: "date-time" },
  },
};

interface Querystring {
  page?: number;
  limit?: number;
  search?: string;
}

const productsRoute: FastifyPluginAsync = async (app) => {
  app.addSchema(productSchema);
  app.get<{
    Querystring: Querystring;
  }>(
    "/products",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1, default: 1 },
            limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
            search: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              data: { type: "array", items: { $ref: "Product#" } },
              page: { type: "integer" },
              totalPages: { type: "integer" },
              total: { type: "integer" },
            },
          },
        },
      },
    },
    async (request) => {
      const { page = 1, limit = 20, search } = request.query;
      const filter: any = {};
      if (search) {
        filter.name = { $regex: search, $options: "i" };
      }
      const total = await ProductModel.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      const products = await ProductModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return { data: products, page, totalPages, total };
    }
  );
};

export default productsRoute;
