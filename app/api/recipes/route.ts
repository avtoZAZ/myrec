import { prisma } from "@/lib/prisma";
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

    await prisma.recipe.upsert({
      where: { id: payload.id },
      update: payload,
      create: payload
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: `Ошибка сохранения: ${(e as Error).message}` }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");

  if (id && action === "delete") {
    await prisma.recipe.delete({ where: { id } }).catch(() => null);
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(recipes);
}
