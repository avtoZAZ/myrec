import { validateImportPayload } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const defaults = { gallery: [], tags: [], prepTimeMinutes: 0, cookTimeMinutes: 0, totalTimeMinutes: 0, servings: 1, featured: false, notes: [] };

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const forcePublish = formData.get("publish") === "1";

  if (!file) return NextResponse.json({ ok: false, error: "Файл не загружен" }, { status: 400 });

  const raw = await file.text();
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Невалидный JSON: проверьте синтаксис файла." }, { status: 400 });
  }

  const validation = validateImportPayload(json);
  if (!validation.ok) return NextResponse.json({ ok: false, error: "Ошибка формата", details: validation.errors }, { status: 400 });

  const payload = validation.data as any;
  const items = Array.isArray(payload.recipes) ? payload.recipes : [payload];

  for (const item of items) {
    const published = forcePublish || payload.publish || item.publish || item.published || false;
    const { publish: _publish, ...recipe } = item;
    const data = { ...defaults, ...recipe, published };
    await prisma.recipe.upsert({
      where: { id: String(item.id) },
      update: data,
      create: data
    });
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}
