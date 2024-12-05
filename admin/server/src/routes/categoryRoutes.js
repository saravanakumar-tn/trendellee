import categoryControllers from "../controllers/categoryControllers.js";

const categoryRoutes = (app) => {
  app.post("/api/categories", categoryControllers.create);
  app.get("/api/categories", categoryControllers.fetch);
  app.get("/api/categories/:id", categoryControllers.get);
  app.put("/api/categories/:id", categoryControllers.update);
  app.delete("/api/categories/:id", categoryControllers.delete);
};

export default categoryRoutes;
