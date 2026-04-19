import { readRecipes } from "./store";

export async function getPublishedRecipes() {
  const recipes = await readRecipes();
  return recipes.filter((r) => r.published).sort((a, b) => (a.id < b.id ? 1 : -1));
}

export async function getRecipeBySlug(slug: string) {
  return (await readRecipes()).find((r) => r.slug === slug) ?? null;
}

export async function getAllRecipes() {
  return readRecipes();
}
