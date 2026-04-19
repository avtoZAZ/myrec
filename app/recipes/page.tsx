import Link from "next/link";
import { getPublishedRecipes } from "@/lib/recipes";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const q = (params.q || "").toLowerCase();
  const category = params.category || "";
  const diff = params.difficulty || "";

  const all = await getPublishedRecipes();
  const filtered = all.filter((r) => {
    const matchQ = !q || r.title.toLowerCase().includes(q) || r.tags.some((t: string) => t.toLowerCase().includes(q));
    const matchC = !category || r.category === category;
    const matchD = !diff || r.difficulty === diff;
    return matchQ && matchC && matchD;
  });

  const categories = [...new Set(all.map((r) => r.category))];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold">Каталог рецептов</h1>
      <form className="glass mt-6 grid gap-3 rounded-3xl p-4 md:grid-cols-4">
        <input name="q" defaultValue={q} placeholder="Поиск" className="rounded-xl border px-3 py-2" />
        <select name="category" defaultValue={category} className="rounded-xl border px-3 py-2"><option value="">Все категории</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <select name="difficulty" defaultValue={diff} className="rounded-xl border px-3 py-2"><option value="">Любая сложность</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
        <button className="rounded-xl bg-espresso px-3 py-2 text-white">Фильтровать</button>
      </form>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <Link href={`/recipes/${r.slug}`} key={r.id} className="rounded-3xl bg-white p-4 shadow transition hover:-translate-y-1">
            <p className="text-xs uppercase text-terracotta">{r.category}</p>
            <h3 className="mt-1 text-xl font-semibold">{r.title}</h3>
            <p className="mt-2 text-sm text-espresso/70">{r.totalTimeMinutes} мин • {r.difficulty}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
