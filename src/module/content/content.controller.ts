import { contentService } from "./content.service";

export function contentController() {
  return {
    readAllContent: async ({ query }: { query?: Record<string, string> }) => {
      const q = query?.q ?? "";
      const data = await contentService.readAllContent(q);

      return {
        success: true,
        message: "Content Read Successfully",
        data,
      };
    },

    readOneContent: async ({ params }: { params: { id: string } }) => {
      const data = await contentService.oneContent(params.id);

      return {
        success: true,
        message: "Content Read Successfully",
        data,
      };
    },

    createContent: async ({ body, AuthRes }: any) => {
      const { slug, title, content, thumbnail, status } = body;

      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      const filename = `${Date.now()}-${thumbnail.name}`;
      const filepath = `./uploads/${filename}`;

      await Bun.write(filepath, buffer);

      const user = await contentService.createContent({
        user_id: AuthRes.id,
        status,
        slug,
        title,
        content,
        thumbnail: `/upload/${filename}`,
      });

      return {
        success: true,
        message: "Content Created Successfully",
        data: user,
      };
    },

    updateContent: async ({
      params,
      body,
    }: {
      params: { id: string };
      body: any;
    }) => {
      const { slug, title, content, thumbnail } = body;

      let file: string = "";

      if (thumbnail) {
        const buffer = Buffer.from(await thumbnail.arrayBuffer());
        const filename = `${Date.now()}-${thumbnail.name}`;
        const filepath = `./uploads/${filename}`;

        await Bun.write(filepath, buffer);

        file = filename;
      }

      const posts = await contentService.editContent({
        id: params.id,
        slug,
        title,
        content,
        ...(file ? { thumbnail: `/upload/${file}` } : {}),
      });

      return {
        success: true,
        message: "Content Created Successfully",
        data: posts,
      };
    },

    deleteContent: async ({ params }: { params: { id: string } }) => {
      const res = await contentService.deleteContent(params.id);
      return {
        success: true,
        message: "Content Delete Successfully",
        data: res,
      };
    },
  };
}
