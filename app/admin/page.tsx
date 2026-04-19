import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getAllRecipes } from "@/lib/recipes";

export default async function AdminPage() {
  await requireAuth();
  const recipes = await getAllRecipes();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Админ-панель</h1>
        <div className="flex gap-2">
          <Link href="/admin/recipes/new" className="rounded-xl bg-espresso px-4 py-2 text-white">+ Добавить</Link>
          <Link href="/api/auth/logout" className="rounded-xl border px-4 py-2">Выйти</Link>
        </div>
      </div>

      <form action="/api/import" method="post" encType="multipart/form-data" className="mb-6 rounded-3xl bg-white p-4 shadow">
        <label className="mb-2 block font-semibold">Импортировать рецепт (JSON)</label>
        <div className="flex flex-wrap gap-3">
          <input type="file" name="file" accept="application/json" required className="rounded-xl border p-2" />
          <label className="flex items-center gap-2"><input type="checkbox" name="publish" value="1" /> Опубликовать сразу</label>
          <button className="rounded-xl bg-saffron px-4 py-2">Импорт</button>
        </div>
      </form>

      <div className="overflow-auto rounded-3xl bg-white shadow">
        <table className="w-full min-w-[700px] text-sm">
          <thead><tr className="border-b"><th className="p-3 text-left">Название</th><th className="p-3">Категория</th><th className="p-3">Статус</th><th className="p-3">Действия</th></tr></thead>
          <tbody>
            {recipes.map((r: any) => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="p-3">{r.title}</td><td className="p-3 text-center">{r.category}</td><td className="p-3 text-center">{r.published ? "Published" : "Draft"}</td>
                <td className="p-3 text-center"><a href={`/admin/recipes/${r.id}/edit`} className="mr-3 text-terracotta">Редактировать</a><a href={`/api/recipes?id=${r.id}&action=delete`} className="text-red-600">Удалить</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
