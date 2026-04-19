import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedRecipes, getRecipeBySlug } from "@/lib/recipes";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return { title: "Рецепт не найден" };
  return { title: `${recipe.title} — MyRec`, description: recipe.description };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  const related = (await getPublishedRecipes()).filter((r) => r.category === recipe.category && r.id !== recipe.id).slice(0, 3);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-bold">{recipe.title}</h1>
      <p className="mt-3 text-lg text-espresso/70">{recipe.description}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-white px-3 py-1">{recipe.totalTimeMinutes} мин</span>
        <span className="rounded-full bg-white px-3 py-1">{recipe.servings} порции</span>
        <span className="rounded-full bg-white px-3 py-1">{recipe.difficulty}</span>
        <PrintButton />
      </div>
      <div className="relative mt-6 h-80 overflow-hidden rounded-3xl"><Image src={recipe.coverImage} alt={recipe.title} fill className="object-cover" /></div>

      <section className="mt-10 grid gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="mb-3 text-2xl font-semibold">Ингредиенты</h2>
          <ul className="space-y-2 rounded-2xl bg-white p-4">{recipe.ingredients.map((i: any, idx: number) => <li key={idx}>• {i.name} {i.amount ? `${i.amount}${i.unit ?? ""}` : ""}</li>)}</ul>
        </div>
        <div>
          <h2 className="mb-3 text-2xl font-semibold">Шаги приготовления</h2>
          <ol className="space-y-4">{recipe.steps.map((s: any, idx: number) => <li key={idx} className="rounded-2xl bg-white p-4"><p className="font-semibold">{idx + 1}. {s.title}</p><p className="mt-2 text-espresso/75">{s.description}</p></li>)}</ol>
        </div>
      </section>

      <section className="mt-10">
        <h3 className="text-2xl font-semibold">Похожие рецепты</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">{related.map((r) => <Link key={r.id} href={`/recipes/${r.slug}`} className="rounded-2xl bg-white p-4 shadow">{r.title}</Link>)}</div>
      </section>
    </main>
  );
}
