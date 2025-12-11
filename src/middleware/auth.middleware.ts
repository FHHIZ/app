import type { Elysia } from "elysia";
import { jwtSetup } from "../helper/jwt.helper";

export const isAuthenticated = (app: Elysia) =>
  app.use(jwtSetup).derive(async ({ accJWT, set, request: { headers } }) => {
    const authorization = headers.get("authorization");

    if (!authorization) {
      set.status = 401;
      throw new Error("Authorization header missing");
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      set.status = 401;
      throw new Error("Invalid authorization format");
    }

    const payload = await accJWT.verify(token);

    if (!payload) {
      set.status = 401;
      throw new Error("Invalid or expired token");
    }

    return {
      userId: payload,
    };
  });
