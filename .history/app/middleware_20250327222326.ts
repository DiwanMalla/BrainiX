import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/", // Homepage
  "/auth(.*)", // Auth pages
  "/api/webhooks(.*)", // Clerk webhooks
]);

export default clerkMiddleware((auth, req) => {
  // If the route is not public, enforce authentication
  if (!isPublicRoute(req)) {
    auth.protect(); // Call protect directly on the auth object
  }
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webm|mp4|md)).*)",
    "/(api|trpc)(.*)",
  ],
};
