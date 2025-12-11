import Elysia from "elysia";
import { isAuthenticated } from "../../middleware/auth.middleware";
import { contentController } from "./content.controller";
import { ContentValidator } from "./content.validator";

export const postRoutes = new Elysia({ prefix: "/content" })
  .use(isAuthenticated)
  .post("/get/all", contentController().readAllContent)
  .post("/get/:id", contentController().readOneContent)
  .post("/post", contentController().createContent, {
    body: ContentValidator().createContent,
  })
  .put("/edit", contentController().updateContent)
  .delete("/delete/:id", contentController().deleteContent);
