import pageControllers from "../controllers/pageControllers.js";

const pageRoutes = (app) => {
  app.post("/api/pages", pageControllers.create);
  app.get("/api/pages", pageControllers.fetch);
  app.get("/api/pages/:id", pageControllers.get);
  app.put("/api/pages/:id", pageControllers.update);
  app.delete("/api/pages/:id", pageControllers.delete);
};

export default pageRoutes;
