import { t } from "elysia";

export function ContentValidator() {
  return {
    readOneContent: t.Object({
      id: t.String({ error: "id not found" }),
    }),

    createContent: t.Object({
      slug: t.String({ error: "Insert Slug" }),
      title: t.String({ error: "Insert Title" }),
      thumbnail: t.File({
        type: "image",
        error: "Insert Thumbnail",
      }),
      content: t.String({ error: "Insert Some Paragraph" }),
      status: t.Optional(t.String()),
    }),
  };
}
