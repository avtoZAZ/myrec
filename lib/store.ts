import bcrypt from "bcryptjs";
import { recipeDefaults } from "./recipe-defaults";
import { prisma } from "./prisma";

const DUMMY_PASSWORD_HASH = "$2a$10$jyi4LgnoHI3ZHVvYCzHYH.25.fVBIVX3PwmyyInJN8vXPuE51LAYm";

const defaults = {
  ...recipeDefaults,
  published: false,
  ingredients: [],
  steps: [],
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
    difficulty: String(recipe.difficulty ?? defaults.difficulty),
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
  if (normalizedRecipes.length === 0) {
    await prisma.recipe.deleteMany({});
    return;
  }

  // Keeps previous file-store semantics: passed array is treated as the full source of truth.
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
  const isValid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
  return Boolean(user) && isValid;
}
