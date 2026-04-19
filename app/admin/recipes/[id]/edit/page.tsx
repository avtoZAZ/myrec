import { requireAuth } from "@/lib/auth";
import { getAllRecipes } from "@/lib/recipes";
import { notFound } from "next/navigation";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const recipe = (await getAllRecipes()).find((r: any) => r.id === id);
  if (!recipe) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Редактирование: {recipe.title}</h1>
      <form action="/api/recipes" method="post" className="mt-5 space-y-3 rounded-3xl bg-white p-6 shadow">
        <input type="hidden" name="mode" value="update" />
        <input name="id" defaultValue={recipe.id} className="w-full rounded-xl border px-3 py-2" readOnly />
        <input name="title" defaultValue={recipe.title} className="w-full rounded-xl border px-3 py-2" required />
        <input name="slug" defaultValue={recipe.slug} className="w-full rounded-xl border px-3 py-2" required />
        <textarea name="description" defaultValue={recipe.description} className="w-full rounded-xl border px-3 py-2" required />
        <input name="coverImage" defaultValue={recipe.coverImage} className="w-full rounded-xl border px-3 py-2" required />
        <input name="category" defaultValue={recipe.category} className="w-full rounded-xl border px-3 py-2" required />
        <input name="difficulty" defaultValue={recipe.difficulty} className="w-full rounded-xl border px-3 py-2" required />
        <input name="totalTimeMinutes" type="number" defaultValue={recipe.totalTimeMinutes} className="w-full rounded-xl border px-3 py-2" required />
        <textarea name="ingredients" defaultValue={JSON.stringify(recipe.ingredients, null, 2)} className="h-28 w-full rounded-xl border px-3 py-2" required />
        <textarea name="steps" defaultValue={JSON.stringify(recipe.steps, null, 2)} className="h-28 w-full rounded-xl border px-3 py-2" required />
        <label className="flex items-center gap-2"><input type="checkbox" name="published" value="1" defaultChecked={recipe.published} /> Опубликован</label>
        <button className="rounded-xl bg-espresso px-5 py-2 text-white">Сохранить</button>
      </form>
    </main>
  );
}
