import { authCookieName } from "@/lib/auth";
import { validateAdmin } from "@/lib/store";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  if (!(await validateAdmin(username, password))) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }

  const store = await cookies();
  store.set(authCookieName, "ok", { httpOnly: true, sameSite: "lax", path: "/" });
  return NextResponse.redirect(new URL("/admin", request.url));
}
