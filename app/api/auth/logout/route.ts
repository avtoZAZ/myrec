import { authCookieName } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const store = await cookies();
  store.delete(authCookieName);
  return NextResponse.redirect(new URL("/", request.url));
}
