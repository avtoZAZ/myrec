import { prisma } from "./prisma";
import { Recipe } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asObject<T extends object>(value: unknown): T | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as T) : undefined;
}

function toRecipe(recipe: any): Recipe {
  return {
    id: recipe.id,
    title: recipe.title,
    slug: recipe.slug,
    description: recipe.description,
    coverImage: recipe.coverImage,
    gallery: asArray<string>(recipe.gallery),
    category: recipe.category,
    tags: asArray<string>(recipe.tags),
    difficulty: recipe.difficulty,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    totalTimeMinutes: recipe.totalTimeMinutes,
    servings: recipe.servings,
    published: recipe.published,
    featured: recipe.featured,
    ingredients: asArray<Recipe["ingredients"][number]>(recipe.ingredients),
    steps: asArray<Recipe["steps"][number]>(recipe.steps),
    notes: asArray<string>(recipe.notes),
    nutrition: asObject<NonNullable<Recipe["nutrition"]>>(recipe.nutrition)
  };
}

export async function getPublishedRecipes() {
  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    orderBy: { id: "desc" }
  });
  return recipes.map(toRecipe);
}

export async function getRecipeBySlug(slug: string) {
  const recipe = await prisma.recipe.findUnique({ where: { slug } });
  return recipe ? toRecipe(recipe) : null;
}

export async function getAllRecipes() {
  const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: "desc" } });
  return recipes.map(toRecipe);
}
