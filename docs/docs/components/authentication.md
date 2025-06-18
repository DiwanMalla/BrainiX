---
sidebar_position: 1
title: Authentication System
description: Secure authentication and authorization system using Clerk
---

# Authentication System

The BrainiX platform implements secure authentication using **Clerk** with role-based access control for Students, Instructors, and Admins.

## Core Features

- **Multi-Provider Authentication** (Email, Google, GitHub)
- **Role-Based Access Control** (RBAC)
- **JWT Token Management** with automatic refresh
- **Session Management** across client and server
- **Route Protection** with middleware

## Clerk Integration

### Middleware Configuration

```typescript
// /middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/auth(.*)",
  "/courses(.*)",
  "/blog(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Redirect to sign-in if accessing protected route without auth
  if (!isPublicRoute(req) && !userId) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## User Roles & Permissions

### Role Definitions

```typescript
enum UserRole {
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN",
}

// Role-based permissions
const PERMISSIONS = {
  STUDENT: ["view_courses", "enroll_courses", "view_progress"],
  INSTRUCTOR: ["create_courses", "manage_own_courses", "view_analytics"],
  ADMIN: ["manage_all_courses", "manage_users", "view_admin_panel"],
};
```

### Role Assignment

```typescript
// API route for role assignment
export async function POST(req: Request) {
  const { userId } = await auth();
  const { role } = await req.json();

  await prisma.user.update({
    where: { clerkId: userId },
    data: { role },
  });

  return Response.json({ success: true });
}
```

## Client-Side Authentication

### Auth Hook

```typescript
// hooks/useAuth.ts
import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useClerkAuth();

  const getCurrentUser = async () => {
    if (!user) return null;

    const token = await getToken();
    const response = await fetch("/api/user/current", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.json();
  };

  return {
    user,
    isLoaded,
    isAuthenticated: !!user,
    getCurrentUser,
  };
};
```

### Protected Components

```typescript
// components/auth/ProtectedRoute.tsx
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) redirect("/auth");

  if (requiredRole && !hasPermission(user.role, requiredRole)) {
    return <div>Unauthorized</div>;
  }

  return <>{children}</>;
}
```

## Server-Side Authentication

### API Route Protection

```typescript
// lib/auth-utils.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  return await prisma.user.findUnique({
    where: { clerkId: userId },
  });
}

export async function requireRole(role: UserRole) {
  const user = await getCurrentUser();

  if (user.role !== role) {
    throw new Error("Insufficient permissions");
  }

  return user;
}
```

### Server Components

```typescript
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

## Role-Based UI Rendering

```typescript
// components/RoleBasedComponent.tsx
import { useAuth } from "@/hooks/useAuth";

interface RoleBasedProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleBasedComponent({
  allowedRoles,
  children,
  fallback,
}: RoleBasedProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Usage
<RoleBasedComponent allowedRoles={["INSTRUCTOR", "ADMIN"]}>
  <CreateCourseButton />
</RoleBasedComponent>;
```

## Webhooks Integration

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const body = await req.text();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    });
  } catch (err) {
    return new Response("Error verifying webhook", { status: 400 });
  }

  const { id, email_addresses, first_name, last_name } = evt.data;

  if (evt.type === "user.created") {
    await prisma.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        role: "STUDENT",
      },
    });
  }

  return new Response("Success", { status: 200 });
}
```

## Security Features

### Token Validation

```typescript
// middleware for API routes
export async function validateToken(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) throw new Error("No token provided");

  try {
    const decoded = await verifyToken(token);
    return decoded.sub; // user ID
  } catch (error) {
    throw new Error("Invalid token");
  }
}
```

This authentication system provides comprehensive security while maintaining excellent developer experience and user convenience.
