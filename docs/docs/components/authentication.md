# Authentication System

The BrainiX platform implements a comprehensive authentication and authorization system using **Clerk** for secure user management with role-based access control.

## Overview

The authentication system provides:
- **Secure User Authentication** with multiple providers
- **Role-Based Access Control** (Student, Instructor, Admin)
- **JWT Token Management** with automatic refresh
- **Session Management** across client and server
- **Route Protection** with middleware
- **Webhook Integration** for user lifecycle events

## Architecture

### Clerk Integration

```typescript
// Middleware Configuration (/middleware.ts)
export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Public routes that don't require authentication
  const isPublicRoute = createRouteMatcher([
    "/",
    "/auth(.*)",
    "/api/webhooks(.*)",
    "/courses(.*)",
    "/blog(.*)",
    "/about(.*)",
    "/contact(.*)",
  ]);

  // Protected routes requiring authentication
  if (!isPublicRoute(req) && !userId) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Role-Based Access Control

The system implements three primary user roles:

#### 1. Student Role
- Access to purchased courses
- Progress tracking and analytics
- Quiz participation and results
- Note-taking capabilities
- Course reviews and ratings

#### 2. Instructor Role
- Course creation and management
- Student analytics and progress monitoring
- Content management (modules, lessons, resources)
- Quiz creation and management
- Revenue and enrollment analytics

#### 3. Admin Role
- Platform-wide user management
- System analytics and monitoring
- Course approval and moderation
- Payment and order oversight
- Content moderation

### User Profile System

```typescript
// User Model Structure
model User {
  id               String            @id @default(cuid())
  clerkId          String            @unique
  email            String            @unique
  firstName        String?
  lastName         String?
  role             Role              @default(STUDENT)
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  
  // Role-specific profiles
  instructorProfile InstructorProfile?
  studentProfile    StudentProfile?
  
  // Related entities
  courses          Course[]          @relation("InstructorCourses")
  enrollments      Enrollment[]
  orders           Order[]
  cart             Cart[]
  wishlist         Wishlist[]
  reviews          Review[]
  notes            Note[]
  messages         Message[]
  blogPosts        Blog[]
  blogComments     BlogComment[]
  blogLikes        BlogLike[]
}

enum Role {
  STUDENT
  INSTRUCTOR
  ADMIN
}
```

## Authentication Flow

### User Registration & Onboarding

1. **Initial Registration** via Clerk authentication
2. **Role Selection** through `/set-role` endpoint
3. **Profile Creation** based on selected role
4. **Welcome Flow** with platform introduction

```typescript
// Role Assignment API (/app/api/set-role/route.ts)
export async function POST(request: Request) {
  const { userId } = await auth();
  const { role } = await request.json();

  // Validate role selection
  if (!['STUDENT', 'INSTRUCTOR'].includes(role)) {
    return NextResponse.json(
      { error: "Invalid role specified" },
      { status: 400 }
    );
  }

  // Create or update user with selected role
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      email: userEmail,
      firstName: userFirstName,
      lastName: userLastName,
      role: role as Role,
    },
    update: {
      role: role as Role,
    },
  });

  // Create role-specific profile
  if (role === 'INSTRUCTOR') {
    await prisma.instructorProfile.create({
      data: { userId: user.id },
    });
  } else {
    await prisma.studentProfile.create({
      data: { userId: user.id },
    });
  }

  return NextResponse.json({ success: true, user });
}
```

### Session Management

```typescript
// Authentication Helper (/lib/auth-helper.ts)
export const getCurrentUser = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      instructorProfile: true,
      studentProfile: true,
    },
  });

  return user;
};

// Role Verification
export const requireRole = (allowedRoles: Role[]) => {
  return async (user: User) => {
    if (!allowedRoles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }
    return user;
  };
};
```

## Security Features

### JWT Token Validation

- **Automatic Token Refresh** - Seamless session extension
- **Token Verification** - Server-side validation on every request
- **Secure Headers** - HTTPS enforcement and security headers
- **CSRF Protection** - Built-in protection against cross-site attacks

### Route Protection

```typescript
// Protected Route Component
export function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode;
  requiredRole?: Role;
}) {
  const { isLoaded, userId, user } = useUser();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (!userId) {
    return <SignInButton />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <UnauthorizedMessage />;
  }

  return <>{children}</>;
}
```

### Data Protection

- **User Data Encryption** - Sensitive data encrypted at rest
- **Secure API Endpoints** - Authentication required for all protected routes
- **Input Validation** - Comprehensive validation using Zod schemas
- **Rate Limiting** - Protection against brute force attacks

## Webhook Integration

### Clerk Webhooks

```typescript
// Clerk Webhook Handler (/app/api/webhooks/clerk/route.ts)
export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("svix-signature");

  // Verify webhook signature
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  const event = wh.verify(payload, {
    "svix-signature": signature,
  });

  switch (event.type) {
    case "user.created":
      // Handle new user registration
      await handleUserCreated(event.data);
      break;
    
    case "user.updated":
      // Sync user profile updates
      await handleUserUpdated(event.data);
      break;
    
    case "user.deleted":
      // Handle user deletion
      await handleUserDeleted(event.data);
      break;
  }

  return NextResponse.json({ received: true });
}
```

## Frontend Integration

### Authentication Context

```tsx
// Authentication Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#8B5CF6",
        },
      }}
    >
      <UserProvider>
        {children}
      </UserProvider>
    </ClerkProvider>
  );
}
```

### Custom Hooks

```tsx
// Custom Authentication Hook
export function useAuth() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user && isLoaded) {
      fetchUserProfile();
    }
  }, [user, isLoaded]);

  const fetchUserProfile = async () => {
    const response = await fetch('/api/user/profile');
    const userData = await response.json();
    setProfile(userData);
  };

  return {
    user,
    profile,
    isLoaded,
    isStudent: profile?.role === 'STUDENT',
    isInstructor: profile?.role === 'INSTRUCTOR',
    isAdmin: profile?.role === 'ADMIN',
  };
}
```

## Best Practices

### Security Guidelines

1. **Always Validate User Permissions** - Check roles on both client and server
2. **Use Middleware Protection** - Implement route-level security
3. **Sanitize User Input** - Validate all incoming data
4. **Implement Rate Limiting** - Protect against abuse
5. **Log Security Events** - Monitor authentication failures

### Performance Optimizations

1. **Cache User Data** - Reduce database queries for user information
2. **Optimize Token Validation** - Use efficient JWT verification
3. **Implement Session Storage** - Store user preferences locally
4. **Lazy Load Profiles** - Load role-specific data on demand

### Error Handling

```typescript
// Centralized Error Handling
export const handleAuthError = (error: any) => {
  if (error.code === 'session_expired') {
    // Redirect to login
    window.location.href = '/auth';
  } else if (error.code === 'insufficient_permissions') {
    // Show access denied message
    toast.error('You do not have permission to access this resource');
  } else {
    // Generic error handling
    toast.error('Authentication error occurred');
  }
};
```

## Testing

### Unit Tests

```typescript
describe('Authentication System', () => {
  test('should authenticate valid user', async () => {
    const user = await authenticateUser(validToken);
    expect(user).toBeDefined();
    expect(user.role).toBe('STUDENT');
  });

  test('should reject invalid token', async () => {
    await expect(authenticateUser(invalidToken)).rejects.toThrow();
  });

  test('should enforce role permissions', async () => {
    const user = { role: 'STUDENT' };
    await expect(requireRole(['INSTRUCTOR'])(user)).rejects.toThrow();
  });
});
```

The authentication system provides a robust foundation for secure user management while maintaining flexibility for different user roles and use cases.
