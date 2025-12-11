import { PrismaClient } from "../../src/generated/prisma";

const prisma = new PrismaClient();
async function main() {
  const momoi = await prisma.users.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "momo128@yahoo.com",
      username: "saibamomoi",
      name: "Momoria",
      password: await Bun.password.hash("1234E6789"),
      role: "admin",
      posts: {
        create: {
          thumbnail: "",
          slug: "tried-shiba-seki-ramen",
          title: "Have you Tried Shiba Seki Ramen?",
          content: "https://www.prisma.io/nextjs",
          status: "published",
        },
      },
    },
  });
  const yuzu = await prisma.users.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "hyuzu@outlook.com",
      username: "uzqueen",
      name: "UZQueen",
      password: await Bun.password.hash("QWERTY!@#"),
      role: "admin",
    },
  });
  console.log({ momoi, yuzu });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
