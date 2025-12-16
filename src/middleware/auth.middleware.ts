import type { Elysia } from "elysia";
import { jwtSetup } from "../helper/jwt.helper";
import { AuthService } from "../module/auth/auth.service";
import { JWTPayloadInput } from "@elysiajs/jwt";
import { JWTPayload } from "../type/auth";

export const isAuthenticated = (app: Elysia) =>
  app.use(jwtSetup).derive(async ({ accJWT, set, request: { headers } }) => {
    const authorization = headers.get("authorization");

    if (!authorization) {
      set.status = 401;
      throw new Error("Unauthorized");
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      set.status = 401;
      throw new Error("Invalid authorization format");
    }

    const payload = (await accJWT.verify(token)) as JWTPayload;

    if (!payload) {
      set.status = 401;
      throw new Error("Invalid or expired token");
    }

    const isAccountExist = await AuthService.findById(payload.id);
    if (!isAccountExist) {
      set.status = 401;
      throw new Error("Invalid or expired token");
    }

    return {
      AuthRes: payload,
    };
  });
