import fs from "node:fs/promises";
import path from "node:path";
import { sampleRecipes } from "./sample-data";

const DATA_DIR = path.join(process.cwd(), "data");
const RECIPES_FILE = path.join(DATA_DIR, "recipes.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try { await fs.access(RECIPES_FILE); } catch { await fs.writeFile(RECIPES_FILE, JSON.stringify(sampleRecipes, null, 2)); }
  try { await fs.access(USERS_FILE); } catch { await fs.writeFile(USERS_FILE, JSON.stringify([{ username: "admin", password: "admin123" }], null, 2)); }
}

export async function readRecipes() {
  await ensureDataFiles();
  return JSON.parse(await fs.readFile(RECIPES_FILE, "utf-8")) as any[];
}

export async function writeRecipes(recipes: any[]) {
  await ensureDataFiles();
  await fs.writeFile(RECIPES_FILE, JSON.stringify(recipes, null, 2));
}

export async function validateAdmin(username: string, password: string) {
  await ensureDataFiles();
  const users = JSON.parse(await fs.readFile(USERS_FILE, "utf-8")) as { username: string; password: string }[];
  return users.some((u) => u.username === username && u.password === password);
}
