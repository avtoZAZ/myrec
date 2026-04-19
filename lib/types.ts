export type Difficulty = "easy" | "medium" | "hard";

export type Recipe = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  gallery: string[];
  category: string;
  tags: string[];
  difficulty: Difficulty;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  published: boolean;
  featured: boolean;
  ingredients: { name: string; amount?: number; unit?: string; note?: string }[];
  steps: { title: string; description: string; image?: string }[];
  notes: string[];
  nutrition?: { calories?: number; protein?: number; fat?: number; carbs?: number };
};
