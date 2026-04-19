import { readRecipes, writeRecipes } from "@/lib/store";
import { NextResponse } from "next/server";

const defaults = { gallery: [], tags: [], prepTimeMinutes: 0, cookTimeMinutes: 0, servings: 1, featured: false, notes: [] };

export async function POST(request: Request) {
  const formData = await request.formData();
  const mode = String(formData.get("mode") || "create");
  const id = String(formData.get("id") || "");

  try {
    const payload = {
      id,
      title: String(formData.get("title") || ""),
      slug: String(formData.get("slug") || ""),
      description: String(formData.get("description") || ""),
      coverImage: String(formData.get("coverImage") || ""),
      category: String(formData.get("category") || ""),
      difficulty: String(formData.get("difficulty") || "medium"),
      totalTimeMinutes: Number(formData.get("totalTimeMinutes") || 0),
      ingredients: JSON.parse(String(formData.get("ingredients") || "[]")),
      steps: JSON.parse(String(formData.get("steps") || "[]")),
      published: formData.get("published") === "1",
      ...defaults
    };

    const recipes = await readRecipes();
    const idx = recipes.findIndex((r) => r.id === id);
    if (mode === "update" && idx >= 0) recipes[idx] = { ...recipes[idx], ...payload };
    else recipes.unshift(payload);
    await writeRecipes(recipes);
  } catch (e) {
    return NextResponse.json({ ok: false, error: `Ошибка сохранения: ${(e as Error).message}` }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");

  const recipes = await readRecipes();

  if (id && action === "delete") {
    await writeRecipes(recipes.filter((r) => r.id !== id));
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.json(recipes);
}
