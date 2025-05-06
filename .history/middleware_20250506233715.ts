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
  "/courses(.*)",
  "/info/instructor",
  "/api/info/instructor(.*)",
  "/about(.*)",
  "/contact(.*)",
  "/api/contact(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();
  const pathname = req.nextUrl.pathname;

  console.log("Middleware - Processing", {
    url: req.url,
    pathname,
    userId,
    isPublic: isPublicRoute(req),
  });

  // Allow SSO, sign-in, and sign-up routes
  if (
    pathname === "/sso-callback" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    console.log("Middleware - Allowing auth route:", pathname);
    return NextResponse.next();
  }

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    console.log("Middleware - Allowing public route:", pathname);
    return NextResponse.next();
  }

  // Protect non-public routes
  console.log("Middleware - Protecting route:", pathname);
  if (!userId) {
    console.log("Middleware - Unauthorized access, redirecting to sign-in");
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webm|mp4|md)).*)",
    "/(api|trpc)(.*)",
  ],
};
