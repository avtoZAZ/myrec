import { prisma } from "@/lib/prisma";
import { recipeDefaults } from "@/lib/recipe-defaults";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const mode = String(formData.get("mode") || "create");
  const id = String(formData.get("id") || "");

  try {
    const payload = {
      ...recipeDefaults,
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
      published: formData.get("published") === "1"
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
    try {
      await prisma.recipe.delete({ where: { id } });
    } catch (error) {
      // Deleting an already-missing recipe should remain a no-op, like the previous file-based behavior.
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2025") throw error;
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const recipes = await prisma.recipe.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(recipes);
}
