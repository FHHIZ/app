import { prisma } from "../../middleware/client";
import { editProfile } from "../../type/login";

export const UserService = {
  checkProfile: (data: string) => {
    return prisma.users.findUnique({
      omit: { id: true, email: true, password: true, createdAt: true },
      where: { id: data },
      include: {
        posts: {},
      },
    });
  },

  readAllUser: (q: string, start: number, end: number) => {
    return prisma.users.findMany({
      skip: start,
      take: end,
      omit: { id: true, email: true, password: true, createdAt: true },
      ...(q
        ? {
            where: {
              OR: [{ name: { contains: q } }, { username: { contains: q } }],
            },
          }
        : {}),
    });
  },

  findById: (data: string) => {
    return prisma.users.findUnique({
      omit: { id: true, email: true, password: true, createdAt: true },
      where: { id: data },
      include: { posts: {} },
    });
  },

  editProfile: (id: string, data: editProfile) => {
    // if(data.id) delete data.id

    return prisma.users.update({
      omit: { id: true, email: true, password: true, createdAt: true },
      where: { id },
      data: data,
    });
  },

  deleteAccount: (id: string) => {
    return prisma.users.delete({
      where: { id },
    });
  },
};
