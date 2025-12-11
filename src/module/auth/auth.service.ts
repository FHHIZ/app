import { prisma } from "../../middleware/client";

export const AuthService = {
  findByEmail: (email: string) => {
    return prisma.users.findUnique({ where: { email } });
  },

  findByUsername: (username: string) => {
    return prisma.users.findUnique({ where: { username } });
  },

  findById: (data: string) => {
    return prisma.users.findUnique({ where: { id: data } });
  },

  register: (data: any) => {
    return prisma.users.create({ data });
  },
};
