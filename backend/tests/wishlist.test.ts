import request from "supertest";
import { buildTestApp } from "./setup";
import ProductModel from "../src/models/product";
import WishlistItemModel from "../src/models/wishlistItem";

let app: any;
let adminToken = "";

beforeAll(async () => {
  app = await buildTestApp();
  adminToken = (app as any).jwt.sign({ sub: "admin", role: "admin" });
});

afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  await WishlistItemModel.deleteMany({});
  await ProductModel.deleteMany({});
  await ProductModel.create({ tonieId: "123", name: "Test Tonie" });
});

describe("Wishlist public propose", () => {
  it("adds product to wishlist", async () => {
    const res = await request(app.server).post("/wishlist/propose/123");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("proposed");

    const items = await WishlistItemModel.find();
    expect(items.length).toBe(1);
  });
});

describe("Wishlist admin add/remove", () => {
  it("adds via admin endpoint", async () => {
    const res = await request(app.server)
      .post("/wishlist/123")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ action: "add" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("added");

    const items = await WishlistItemModel.find();
    expect(items.length).toBe(1);
  });

  it("removes via admin endpoint", async () => {
    // first add directly
    const prod = await ProductModel.findOne({ tonieId: "123" });
    await WishlistItemModel.create({ product: prod!._id });

    const res = await request(app.server)
      .post("/wishlist/123")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ action: "remove" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("removed");

    const items = await WishlistItemModel.find();
    expect(items.length).toBe(0);
  });
});
