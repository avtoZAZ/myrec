import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const defaults = {
  gallery: [],
  tags: [],
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  totalTimeMinutes: 0,
  servings: 1,
  published: false,
  featured: false,
  ingredients: [],
  steps: [],
  notes: [],
  nutrition: null
};

function toRecipeData(recipe: any) {
  return {
    id: String(recipe.id),
    title: String(recipe.title ?? ""),
    slug: String(recipe.slug ?? ""),
    description: String(recipe.description ?? ""),
    coverImage: String(recipe.coverImage ?? ""),
    category: String(recipe.category ?? ""),
    difficulty: String(recipe.difficulty ?? "medium"),
    prepTimeMinutes: Number(recipe.prepTimeMinutes ?? defaults.prepTimeMinutes),
    cookTimeMinutes: Number(recipe.cookTimeMinutes ?? defaults.cookTimeMinutes),
    totalTimeMinutes: Number(recipe.totalTimeMinutes ?? defaults.totalTimeMinutes),
    servings: Number(recipe.servings ?? defaults.servings),
    published: Boolean(recipe.published ?? defaults.published),
    featured: Boolean(recipe.featured ?? defaults.featured),
    gallery: Array.isArray(recipe.gallery) ? recipe.gallery : defaults.gallery,
    tags: Array.isArray(recipe.tags) ? recipe.tags : defaults.tags,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : defaults.ingredients,
    steps: Array.isArray(recipe.steps) ? recipe.steps : defaults.steps,
    notes: Array.isArray(recipe.notes) ? recipe.notes : defaults.notes,
    nutrition: recipe.nutrition && typeof recipe.nutrition === "object" ? recipe.nutrition : defaults.nutrition
  };
}

export async function readRecipes() {
  return prisma.recipe.findMany({ orderBy: { createdAt: "desc" } });
}

export async function writeRecipes(recipes: any[]) {
  const normalizedRecipes = recipes.map(toRecipeData);
  await prisma.$transaction([
    prisma.recipe.deleteMany({ where: { id: { notIn: normalizedRecipes.map((r) => r.id) } } }),
    ...normalizedRecipes.map((recipe) =>
      prisma.recipe.upsert({
        where: { id: recipe.id },
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
