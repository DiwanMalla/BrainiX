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
export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Public routes
  const isPublicRoute = createRouteMatcher([
    "/",
    "/auth(.*)",
    "/courses(.*)",
    "/blog(.*)",
    "/api/webhooks(.*)",
  ]);

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

interface UserPermissions {
  courses: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  users: {
    view: boolean;
    manage: boolean;
  };
  analytics: {
    view: boolean;
  };
}

const rolePermissions: Record<UserRole, UserPermissions> = {
  STUDENT: {
    courses: { view: true, create: false, edit: false, delete: false },
    users: { view: false, manage: false },
    analytics: { view: false },
  },
  INSTRUCTOR: {
    courses: { view: true, create: true, edit: true, delete: true },
    users: { view: false, manage: false },
    analytics: { view: true },
  },
  ADMIN: {
    courses: { view: true, create: true, edit: true, delete: true },
    users: { view: true, manage: true },
    analytics: { view: true },
  },
};
```

### Role Assignment

```typescript
// Automatic role assignment after sign-up
export async function POST(request: Request) {
  const { data } = await request.json();
  const { id, email_addresses, first_name, last_name } = data;

  try {
    // Create user in database with default STUDENT role
    const user = await prisma.user.create({
      data: {
        id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        role: UserRole.STUDENT, // Default role
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
```

## Authentication Hooks

### Custom Authentication Hook

```typescript
// useAuth.ts
export function useAuth() {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<User | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserFromDB(user.id).then(setDbUser);
    }
  }, [isLoaded, user]);

  return {
    user: dbUser,
    isAuthenticated: !!user,
    isLoading: !isLoaded,
    role: dbUser?.role,
    hasPermission: (permission: string) =>
      checkPermission(dbUser?.role, permission),
  };
}

// Permission checking utility
function checkPermission(role: UserRole, permission: string): boolean {
  const permissions = rolePermissions[role];
  return permissions ? hasAccess(permissions, permission) : false;
}
```

## Route Protection

### Protected Route Component

```typescript
// ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (requiredRole && user.role !== requiredRole) {
    return <AccessDenied />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
```

### API Route Protection

```typescript
// Protect API routes with role checking
export async function withAuth(
  handler: (req: Request, user: User) => Promise<Response>,
  requiredRole?: UserRole
) {
  return async (request: Request) => {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (requiredRole && user.role !== requiredRole) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(request, user);
  };
}

// Usage in API route
export const GET = withAuth(async (request, user) => {
  // Handler logic with authenticated user
  return NextResponse.json({ user });
}, UserRole.INSTRUCTOR);
```

## Session Management

### User Session Handling

```typescript
// Get current user session
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();

  if (!userId) return null;

  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: true,
      createdCourses: true,
    },
  });
}

// Update user profile
export async function updateUserProfile(userId: string, data: Partial<User>) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      bio: data.bio,
      profileImage: data.profileImage,
      updatedAt: new Date(),
    },
  });
}
```

## Security Features

### Security Measures

- **HTTPS Enforcement** in production
- **CSRF Protection** via SameSite cookies
- **Rate Limiting** on authentication endpoints
- **Session Timeout** with automatic renewal
- **Secure Headers** via middleware
- **Input Validation** on all forms

### Webhook Security

```typescript
// Verify Clerk webhooks
export async function POST(request: Request) {
  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  try {
    const payload = await wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });

    const { type, data } = payload;

    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;
      case "user.updated":
        await handleUserUpdated(data);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
```

---

_The authentication system provides secure, scalable user management with fine-grained access control for the BrainiX platform._
