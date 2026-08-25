import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const sessionCookie = request.cookies.get("user_session")?.value;
  const tokenCookie =
    request.cookies.get("token")?.value ||
    request.cookies.get("auth_token")?.value;

  const isAuthenticated = Boolean(sessionCookie || tokenCookie);

  let userRole = "";
  if (sessionCookie) {
    try {
      const parsed = JSON.parse(sessionCookie);
      userRole = (parsed.role || "").toLowerCase();
    } catch {
      // Ignore JSON error
    }
  }

  // 1. Protected Admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // If logged in as customer, redirect to customer portal
    if (userRole && userRole !== "admin") {
      return NextResponse.redirect(new URL("/customer", request.url));
    }
  }

  // 2. Protected Customer routes
  if (pathname.startsWith("/customer")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. Legacy /dashboard/* bookmarks - that route tree was removed (it was
  // dead code backed by a separate, broken local-auth system). Send people
  // to the equivalent real page based on their role.
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/customer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/dashboard/:path*"],
};