import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sampleRecipes } from "../lib/sample-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: await bcrypt.hash("admin123", 10)
    }
  });

  for (const r of sampleRecipes) {
    await prisma.recipe.upsert({
      where: { id: r.id },
      update: r,
      create: r
    });
  }
}

main().finally(() => prisma.$disconnect());
