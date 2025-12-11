import { prisma } from "../../middleware/client";
import { ContentUpdateReq } from "../../type/content";

export const contentService = {
  readAllContent: (query?: string) => {
    return prisma.posts.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        author: {
          omit: {
            username: true,
            email: true,
            password: true,
            createdAt: true,
          },
        },
      },
    });
  },

  oneContent: (id: string) => {
    return prisma.posts.findUnique({
      omit: { createdAt: true },
      where: { id: id },
      include: {
        author: {
          omit: {
            username: true,
            email: true,
            password: true,
            createdAt: true,
          },
        },
      },
    });
  },

  createContent: (data: any) => {
    return prisma.posts.create({
      data,
      include: {
        author: {
          omit: {
            username: true,
            email: true,
            password: true,
            createdAt: true,
          },
        },
      },
    });
  },

  editContent: (data: ContentUpdateReq) => {
    return prisma.posts.update({
      data,
      where: { id: data.id },
      omit: { id: true },
      include: {
        author: {
          omit: {
            username: true,
            email: true,
            password: true,
            createdAt: true,
          },
        },
      },
    });
  },

  deleteContent: (id: string) => {
    return prisma.posts.delete({
      where: { id },
    });
  },
};
