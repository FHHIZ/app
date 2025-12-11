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
  .onError(({ code, set }) => {
    switch (code) {
      case "NOT_FOUND":
        set.status = 404;
        return { error: "Route not found" };
      case "VALIDATION":
        set.status = 422;
        return { error: "Invalid request" };
      case "INTERNAL_SERVER_ERROR":
        set.status = 500;
        return { error: "Server Error :'(" };
    }
  })
  .listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
