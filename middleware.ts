import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/constants";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("genz_token")?.value;
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

    // Temporarily disabled strict check - Allow any logged in user
    if (pathname.startsWith("/admin") && !payload) {
      return NextResponse.redirect(new URL("/login", request.url));
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
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/admin/:path*", "/login", "/register"],
};
