import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("kiro_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Handle Dashboard & Admin protection
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Strict Admin check
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Redirect logged-in users away from login/register
  if ((pathname === "/login" || pathname === "/register") && token) {
    const payload = await verifyJWT(token);
    if (payload) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
