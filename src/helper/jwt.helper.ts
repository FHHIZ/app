import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";

export const jwtSetup = new Elysia()
  .use(
    jwt({
      name: "accJWT",
      secret: process.env.JWT_SECRET!,
      exp: "15m",
    })
  )
  .use(
    jwt({
      name: "rfJWT",
      secret: process.env.JWT_SECRET!,
      exp: "14d",
    })
  );
