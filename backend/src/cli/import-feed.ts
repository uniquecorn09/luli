#!/usr/bin/env node
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { importFeed } from "../services/feedImporter";

dotenv.config();

async function run() {
  const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/luli";
  const FEED_URL = process.env.FEED_URL;
  if (!FEED_URL) {
    console.error("FEED_URL env variable missing");
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  const count = await importFeed(FEED_URL);
  console.log(`Imported/updated ${count} products`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
