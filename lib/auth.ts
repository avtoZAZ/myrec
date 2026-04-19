import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE = "myrec_admin";

export async function isAuthed() {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value === "ok";
}

export async function requireAuth() {
  if (!(await isAuthed())) redirect("/admin/login");
}

export const authCookieName = AUTH_COOKIE;
