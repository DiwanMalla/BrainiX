import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/auth(.*)",
  "/api/webhooks(.*)", // Allow Clerk webhooks to bypass auth
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect(); // Protect all non-public routes
  }
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webm|mp4|md)).*)",
    "/(api|trpc)(.*)",
  ],
};
