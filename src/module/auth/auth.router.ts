import { Elysia, t } from "elysia";
import { AuthController } from "./auth.controller";
import AuthValidator from "./auth.validator";
import { jwtSetup } from "../../helper/jwt.helper";

export const AuthRoutes = new Elysia({ prefix: "/auth" })
  .use(jwtSetup)
  .post("/login", AuthController().login, {
    body: AuthValidator.login,
  })
  .post("/register", AuthController().register, {
    body: AuthValidator.register,
  })
  .post("/refresh", AuthController().refresh)
  .delete("/logout", AuthController().logout);
