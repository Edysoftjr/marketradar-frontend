import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/about",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if user is authenticated (has access token in cookies or headers)
  const accessToken =
    request.cookies.get("accessToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // If accessing a protected route without authentication, redirect to login
  if (!isPublicRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login/signup while authenticated, redirect to dashboard
  if ((pathname === "/login" || pathname === "/signup") && accessToken) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // For dashboard route, ensure we have a valid token
  if (pathname === "/dashboard" && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
