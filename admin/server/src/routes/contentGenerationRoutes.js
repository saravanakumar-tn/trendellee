import contentGenerationControllers from "../controllers/contentGenerationController.js";

const contentGenerationRoutes = (app) => {
  app.post("/api/content", contentGenerationControllers.post);
};

export default contentGenerationRoutes;
