import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";

// Auth token storage uses localStorage (client-side only).
// Admin route protection is handled by AdminLayout on the client.
export const proxy = convexAuthNextjsMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
