import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin/(.*)"]);
const isLoginPage = createRouteMatcher(["/admin/login"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isAdminRoute(request) && !isLoginPage(request)) {
    if (!(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/admin/login");
    }
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
