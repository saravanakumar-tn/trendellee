import fastify from "fastify";
import mongoose from "mongoose";

import categoryRoutes from "./routes/categoryRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";
import trendRoutes from "./routes/trendRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import contentGenerationRoutes from "./routes/contentGenerationRoutes.js";
import miscRoutes from "./miscRoutes/miscRoutes.js";

const app = fastify({
  logger: true,
});

try {
  mongoose.connect("mongodb://localhost:27017/trendellee");
} catch (e) {
  console.error(e);
}

categoryRoutes(app);
regionRoutes(app);
trendRoutes(app);
pageRoutes(app);
contentGenerationRoutes(app);
miscRoutes(app);


/**
 * Run the server!
 */
const start = async () => {
  try {
    await app.listen({ port: 5000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
