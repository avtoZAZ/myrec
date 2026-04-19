import { authCookieName } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }

  const store = await cookies();
  store.set(authCookieName, "ok", { httpOnly: true, sameSite: "lax", path: "/" });
  return NextResponse.redirect(new URL("/admin", request.url));
}
