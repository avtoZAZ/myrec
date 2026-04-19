import Link from "next/link";
import { MotionSection } from "@/components/motion-section";
import { RecipeCard } from "@/components/recipe-card";
import { getPublishedRecipes } from "@/lib/recipes";

export default async function HomePage() {
  const recipes = await getPublishedRecipes();
  const featured = recipes.filter((r) => r.featured).slice(0, 3);
  const latest = recipes.slice(0, 6);
  const categories = [...new Set(recipes.map((r) => r.category))];

  return (
    <main>
      <section className="relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061')] bg-cover bg-center">
        <div className="absolute inset-0 bg-espresso/55" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-white md:py-36">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">Готовьте красиво. Делитесь вкусом.</h1>
          <p className="mt-5 max-w-xl text-white/90">Премиум-коллекция рецептов с эстетикой food magazine, фильтрами и пошаговым приготовлением.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/recipes" className="rounded-full bg-saffron px-6 py-3 font-semibold text-espresso transition hover:scale-105">Смотреть рецепты</Link>
            <Link href="/admin" className="rounded-full border border-white/60 px-6 py-3 transition hover:bg-white/10">Админка</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-14">
        <MotionSection>
          <div className="mb-5 flex items-center justify-between"><h2 className="text-3xl font-bold">Популярные</h2></div>
          <div className="grid gap-6 md:grid-cols-3">{featured.map((r) => <RecipeCard key={r.id} recipe={r as any} />)}</div>
        </MotionSection>

        <MotionSection>
          <h2 className="mb-5 text-3xl font-bold">Новые рецепты</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{latest.map((r) => <RecipeCard key={r.id} recipe={r as any} />)}</div>
        </MotionSection>

        <MotionSection>
          <h2 className="mb-5 text-3xl font-bold">Категории</h2>
          <div className="flex flex-wrap gap-3">{categories.map((c) => <span key={c} className="rounded-full bg-white px-5 py-2 shadow">{c}</span>)}</div>
        </MotionSection>

        <MotionSection className="rounded-3xl bg-espresso px-8 py-14 text-white">
          <h3 className="text-3xl font-semibold">Добавляйте свои рецепты в два клика</h3>
          <p className="mt-2 max-w-2xl text-white/80">Импортируйте JSON, редактируйте в админке, публикуйте и делитесь ссылкой.</p>
          <Link href="/admin/recipes/new" className="mt-6 inline-block rounded-full bg-saffron px-6 py-3 font-semibold text-espresso">Добавить рецепт</Link>
        </MotionSection>
      </div>
    </main>
  );
}
