import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  "/",
  "/auth(.*)",
  "/api/webhooks(.*)",
  "/api/set-role",
  "/sso-callback",
  "/set-role",
]);

// Define instructor-only routes
const isInstructorRoute = createRouteMatcher([
  "/instructor(.*)",
  "/api/instructor(.*)",
]);

// Define student-only routes
const isStudentRoute = createRouteMatcher(["/student(.*)", "/api/student(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, getUser } = await auth();

  // Log the request for debugging
  console.log("Middleware - Path:", req.url, "Public:", isPublicRoute(req));

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect non-public routes (require authentication)
  if (!userId) {
    auth.protect();
    return; // This will redirect to the sign-in page if not authenticated
  }

  // Fetch the user to get their role from publicMetadata
  const user = await getUser();
  const role = (user?.publicMetadata?.role as string) || "student";
  console.log("Middleware - User:", userId, "Role:", role);

  // Role-based access control
  if (isInstructorRoute(req) && role !== "instructor") {
    console.log("Middleware - Access Denied: User is not an instructor");
    return NextResponse.redirect(new URL("/dashboard/student", req.url));
  }

  if (isStudentRoute(req) && role !== "student") {
    console.log("Middleware - Access Denied: User is not a student");
    return NextResponse.redirect(new URL("/dashboard/instructor", req.url));
  }

  // Redirect users to their respective dashboards
  if (req.nextUrl.pathname === "/dashboard") {
    if (role === "instructor") {
      return NextResponse.redirect(new URL("/dashboard/instructor", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard/student", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webm|mp4|md)).*)",
    "/(api|trpc)(.*)",
  ],
};
