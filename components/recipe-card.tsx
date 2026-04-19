import Link from "next/link";
import Image from "next/image";
import { Recipe } from "@/lib/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block overflow-hidden rounded-3xl bg-white shadow-premium transition hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden">
        <Image src={recipe.coverImage} alt={recipe.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-terracotta">{recipe.category}</p>
        <h3 className="text-xl font-semibold">{recipe.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-espresso/70">{recipe.description}</p>
      </div>
    </Link>
  );
}
