import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const proxy = convexAuthNextjsMiddleware((request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (isAdminRoute) {
    const hasAuth =
      request.cookies.get("__convexAuthJWT") ||
      request.cookies.get("__convexAuthRefreshToken");
    if (!hasAuth) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
