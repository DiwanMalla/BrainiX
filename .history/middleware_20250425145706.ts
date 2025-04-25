import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth(.*)",
  "/api/webhooks(.*)",
  "/api/set-role",
  "/sso-callback",
  "/set-role",
  "/api/courses/:path*",
  "/courses/:path*",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  console.log("Middleware - Request URL:", req.nextUrl.pathname, {
    userId: auth().userId,
  });
  if (
    req.nextUrl.pathname === "/sso-callback" ||
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up")
  ) {
    console.log(
      "Middleware - Allowing SSO/sign-in/sign-up route:",
      req.nextUrl.pathname
    );
    return NextResponse.next();
  }
  if (!isPublicRoute(req)) {
    console.log("Middleware - Protecting route:", req.nextUrl.pathname);
    auth().protect();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webm|mp4|md)).*)",
    "/(api|trpc)(.*)",
  ],
};
