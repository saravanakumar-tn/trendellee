import regionControllers from "../controllers/regionControllers.js";

const regionRoutes = (app) => {
  app.post("/api/regions", regionControllers.create);
  app.get("/api/regions", regionControllers.fetch);
  app.get("/api/regions/:id", regionControllers.get);
  app.put("/api/regions/:id", regionControllers.update);
  app.delete("/api/regions/:id", regionControllers.delete);
};

export default regionRoutes;
