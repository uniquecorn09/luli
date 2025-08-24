import request from "supertest";
import { buildTestApp } from "./setup";

let app: any;

beforeAll(async () => {
  app = await buildTestApp();
});

afterAll(async () => {
  await app.close();
});

describe("GET /products", () => {
  it("returns empty list initially", async () => {
    const res = await request(app.server).get("/products");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});
