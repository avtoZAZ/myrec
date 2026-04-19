import { validateImportPayload } from "@/lib/validators";
import { readRecipes, writeRecipes } from "@/lib/store";
import { NextResponse } from "next/server";

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
  const recipes = await readRecipes();

  for (const item of items) {
    const published = forcePublish || payload.publish || item.publish || item.published || false;
    const idx = recipes.findIndex((r) => r.id === item.id);
    if (idx >= 0) recipes[idx] = { ...recipes[idx], ...item, published };
    else recipes.unshift({ ...item, published });
  }

  await writeRecipes(recipes);
  return NextResponse.redirect(new URL("/admin", request.url));
}
