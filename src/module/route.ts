import { Elysia } from "elysia";
import { AuthRoutes } from "./auth/auth.router";
import cookie from "@elysiajs/cookie";
import { postRoutes } from "./content/content.router";
import { UserRoutes } from "./users/user.router";
import fs from "fs";

export const Route = new Elysia()
  .get("/", () => "Hello, Cyrene")
  .group(
    "/api",
    (app) =>
      app
        .use(cookie())
        .use(AuthRoutes)
        .use(UserRoutes)
        .use(cookie().use(postRoutes))
    // .use(CommentRoutes)
    // .use(CategoryRoutes)
    // .use(TagRoutes)
  )
  .group("/upload", (app) =>
    app.get("/:id", ({ params }) => {
      const path = `./uploads/${params.id}`;
      if (!fs.existsSync(path))
        return new Response("File not found", { status: 404 });
      return fs.createReadStream(path);
    })
  );
