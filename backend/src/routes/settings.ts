import { FastifyPluginAsync } from "fastify";
import { importFeed } from "../services/feedImporter";

interface UpdateFeedBody {
  feedUrl?: string;
}

const settingsRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: UpdateFeedBody }>(
    "/settings/update-feed",
    { preHandler: [app.authenticate, app.adminOnly] },
    async (request) => {
      const feedUrl = request.body.feedUrl || process.env.FEED_URL;
      if (!feedUrl) return { error: "feedUrl missing" };
      const count = await importFeed(feedUrl);
      return { status: "feed_updated", count };
    }
  );
};

export default settingsRoutes;
