import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function readRecipes() {
  return prisma.recipe.findMany({ orderBy: { createdAt: "desc" } });
}

export async function writeRecipes(recipes: any[]) {
  await prisma.$transaction([
    prisma.recipe.deleteMany({ where: { id: { notIn: recipes.map((r) => String(r.id)) } } }),
    ...recipes.map((recipe) =>
      prisma.recipe.upsert({
        where: { id: String(recipe.id) },
        update: recipe,
        create: recipe
      })
    )
  ]);
}

export async function validateAdmin(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}
