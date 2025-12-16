import Elysia from "elysia";
import { isAuthenticated } from "../../middleware/auth.middleware";
import { UserController } from "./user.controller";
import { jwtSetup } from "../../helper/jwt.helper";
import UserValidator from "./user.validator";

export const UserRoutes = new Elysia({ prefix: "/user" })
  .use(jwtSetup)
  .post("/show/:id", UserController().showOne)
  .post("/show/all", UserController().showAll, {
    query: UserValidator.query,
  })
  .use(isAuthenticated)
  .get("/show/me", UserController().showMe)
  .put("/edit/me", UserController().editMe)
  .delete("/restricted/delete", UserController().deleteAccount)
  .put("/editAsAdmin/:id", UserController().editAsAdmin, {
    body: UserValidator.editAsAdmin,
  })
  .delete("deleteAsAdmin/:id", UserController().deleteAsAdmin);
