import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { Route } from "./module/route";

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:5173", // demi imperator dan laurus salad, plis ubah * jadi url sebelum di production
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    })
  )
  .use(Route)
  .listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
