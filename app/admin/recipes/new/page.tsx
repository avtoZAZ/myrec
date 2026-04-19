import { requireAuth } from "@/lib/auth";

export default async function NewRecipePage() {
  await requireAuth();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Новый рецепт</h1>
      <form action="/api/recipes" method="post" className="mt-5 space-y-3 rounded-3xl bg-white p-6 shadow">
        <input name="id" placeholder="id (например, borsh-001)" className="w-full rounded-xl border px-3 py-2" required />
        <input name="title" placeholder="Название" className="w-full rounded-xl border px-3 py-2" required />
        <input name="slug" placeholder="slug" className="w-full rounded-xl border px-3 py-2" required />
        <textarea name="description" placeholder="Описание" className="w-full rounded-xl border px-3 py-2" required />
        <input name="coverImage" placeholder="URL обложки" className="w-full rounded-xl border px-3 py-2" required />
        <input name="category" placeholder="Категория" className="w-full rounded-xl border px-3 py-2" required />
        <input name="difficulty" placeholder="easy|medium|hard" className="w-full rounded-xl border px-3 py-2" defaultValue="medium" required />
        <input name="totalTimeMinutes" type="number" placeholder="Общее время" className="w-full rounded-xl border px-3 py-2" defaultValue={30} required />
        <textarea name="ingredients" placeholder='Ингредиенты JSON: [{"name":"..."}]' className="h-28 w-full rounded-xl border px-3 py-2" required />
        <textarea name="steps" placeholder='Шаги JSON: [{"title":"...","description":"..."}]' className="h-28 w-full rounded-xl border px-3 py-2" required />
        <label className="flex items-center gap-2"><input type="checkbox" name="published" value="1" /> Опубликовать</label>
        <button className="rounded-xl bg-espresso px-5 py-2 text-white">Сохранить</button>
      </form>
    </main>
  );
}
