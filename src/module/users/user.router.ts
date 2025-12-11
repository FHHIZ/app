import Elysia from "elysia";
import { isAuthenticated } from "../../middleware/auth.middleware";
import { UserController } from "./user.controller";
import { jwtSetup } from "../../helper/jwt.helper";


export const UserRoutes = new Elysia({ prefix: "/user" })
  .use(jwtSetup)
  .use(isAuthenticated)
  .get("/show/me", UserController().showMe)
  .post("/show/:id", UserController().showOne)
  .post("/show/all", UserController().showAll)
  .put("/edit/me", UserController().editMe)
  .delete("/restricted/delete/:id", UserController().deleteAccount);
