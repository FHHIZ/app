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

  readAllUser: (query?: string) => {
    if (query) {
      return prisma.users.findMany({
        omit: { id: true, email: true, password: true, createdAt: true },
        where: { name: { contains: query }, username: { contains: query } },
      });
    } else
      return prisma.users.findMany({
        omit: { id: true, email: true, password: true, createdAt: true },
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
    return prisma.users.update({ where: { id }, data: data });
  },

  deleteAccount: (id: string) => {
    return prisma.users.delete({
      where: { id },
    });
  },
};
