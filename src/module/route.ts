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
        .onAfterHandle(({ responseValue, store }: any) => ({
          success: true,
          message: store.message ?? "Request Successful",
          data: responseValue,
        }))
        .onError(({ error, code, set }) => {
          switch (code) {
            case "NOT_FOUND":
              set.status = 404;
              return { error: "Route not found" };
            case "VALIDATION":
              set.status = 422;
              return { success: false, message: error.customError };
            case "INTERNAL_SERVER_ERROR":
              set.status = 500;
              return { error: "Server Error :'(" };
            case "PARSE":
              return { success: false, message: error.message };
            case "INVALID_COOKIE_SIGNATURE":
              return { success: false, message: error.message };
            case "INVALID_FILE_TYPE":
              return { success: false, message: error.message };
            case "UNKNOWN":
              return { success: false, message: error.message };
            default:
              set.status = error.code;
              return { success: false, message: error.response };
          }
        })
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
