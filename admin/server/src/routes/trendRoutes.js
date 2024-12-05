import trendControllers from "../controllers/trendControllers.js";

const trendRoutes = (app) => {
  app.post("/api/trends", trendControllers.create);
  app.get("/api/trends", trendControllers.fetch);
  app.get("/api/trends/:id", trendControllers.get);
  app.put("/api/trends/:id", trendControllers.update);
  app.delete("/api/trends/:id", trendControllers.delete);
};

export default trendRoutes;
