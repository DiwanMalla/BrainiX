---
sidebar_position: 2
title: Technology Stack
description: Comprehensive overview of technologies, frameworks, and tools used in BrainiX
---

# Technology Stack

BrainiX leverages a modern, production-ready technology stack designed for scalability, performance, and developer experience. This document details every technology choice and the reasoning behind each decision.

## 🎯 Technology Philosophy

Our technology selections are based on:
- **Developer Experience**: Modern tooling with excellent DX
- **Performance**: Optimized for speed and efficiency  
- **Scalability**: Ready for enterprise-level growth
- **Community**: Strong ecosystem and long-term support
- **Security**: Industry-standard security practices

## 🖥️ Frontend Technologies

### Core Framework

<div className="tech-specs">

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Next.js** | 14.2.x | React Framework | App Router, SSR/SSG, API routes, excellent DX |
| **React** | 18.3.x | UI Library | Component-based, huge ecosystem, team expertise |
| **TypeScript** | 5.4.x | Type System | Type safety, better IDE support, fewer runtime errors |

</div>

```typescript
// Next.js 14 App Router configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@prisma/client'],
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react']
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif']
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.optimization.usedExports = true;
    }
    return config;
  }
};
```

### Styling & UI

<div className="tech-specs">

| Technology | Version | Purpose | Benefits |
|------------|---------|---------|----------|
| **Tailwind CSS** | 3.4.x | Utility-first CSS | Rapid development, consistent design, small bundle |
| **Radix UI** | 1.0.x | Headless components | Accessibility, customization, TypeScript support |
| **Shadcn/ui** | Latest | Component library | Pre-built components, Radix + Tailwind integration |
| **Lucide React** | 0.4.x | Icon library | Consistent icons, tree-shakeable, lightweight |

</div>

```typescript
// Tailwind CSS configuration
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... other custom colors
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        // ... other animations
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### State Management & Data Fetching

<div className="tech-specs">

| Technology | Version | Purpose | Implementation |
|------------|---------|---------|----------------|
| **React Context** | Built-in | Global state | User context, cart context, theme context |
| **React Hook Form** | 7.5.x | Form management | Type-safe forms, validation, performance |
| **Zod** | 3.23.x | Schema validation | Runtime type checking, form validation |
| **SWR / React Query** | 2.2.x | Data fetching | Caching, revalidation, optimistic updates |

</div>

```typescript
// Global state management with Context
interface AppContextType {
  user: User | null;
  cart: CartItem[];
  theme: 'light' | 'dark';
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (courseId: string) => Promise<void>;
  toggleTheme: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// Form management with React Hook Form + Zod
const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(10).max(5000),
  price: z.number().positive().max(9999.99),
  categoryId: z.string().uuid()
});

type CourseFormData = z.infer<typeof courseSchema>;

const CourseForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema)
  });
  
  const onSubmit = async (data: CourseFormData) => {
    // Handle form submission
  };
};
```

## 🔧 Backend Technologies

### Runtime & Framework

<div className="tech-specs">

| Technology | Version | Purpose | Advantages |
|------------|---------|---------|------------|
| **Node.js** | 20.x LTS | Runtime environment | JavaScript everywhere, large ecosystem |
| **Next.js API Routes** | 14.2.x | Backend framework | Serverless functions, edge runtime support |
| **Middleware** | Custom | Request processing | Authentication, validation, logging |

</div>

### Database & ORM

<div className="tech-specs">

| Technology | Version | Purpose | Benefits |
|------------|---------|---------|---------|
| **PostgreSQL** | 15.x | Primary database | ACID compliance, JSON support, performance |
| **Prisma** | 5.1.x | ORM & Query Builder | Type safety, migrations, excellent DX |
| **Redis** | 7.x | Caching layer | In-memory performance, pub/sub, sessions |

</div>

```typescript
// Prisma schema example
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String @id @default(cuid())
  email    String @unique
  name     String
  role     UserRole @default(STUDENT)
  
  // Relations
  courses     Course[]     @relation("InstructorCourses")
  enrollments Enrollment[]
  orders      Order[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

model Course {
  id          String  @id @default(cuid())
  title       String
  description String  @db.Text
  price       Decimal @db.Decimal(10, 2)
  published   Boolean @default(false)
  
  // Relations
  instructor   User   @relation("InstructorCourses", fields: [instructorId], references: [id])
  instructorId String
  
  modules     Module[]
  enrollments Enrollment[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("courses")
}
```

## 🔐 Authentication & Security

<div className="tech-specs">

| Technology | Version | Purpose | Features |
|------------|---------|---------|----------|
| **Clerk** | 4.29.x | Authentication | SSO, MFA, user management, webhooks |
| **JWT** | Standard | Token format | Stateless authentication, claims-based |
| **bcrypt** | 5.1.x | Password hashing | Secure password storage |
| **Helmet** | 7.0.x | Security headers | XSS protection, CSRF prevention |

</div>

```typescript
// Clerk middleware configuration
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/courses(.*)',
  '/api/webhooks(.*)'
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

## 💳 Payment Processing

<div className="tech-specs">

| Technology | Version | Purpose | Integration |
|------------|---------|---------|-------------|
| **Stripe** | Latest | Payment processing | Checkout, webhooks, subscriptions |
| **Stripe Elements** | Latest | Secure forms | PCI compliance, card processing |

</div>

```typescript
// Stripe integration
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Create checkout session
export async function createCheckoutSession(orderData: OrderData) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: orderData.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.course.title,
          description: item.course.description,
        },
        unit_amount: Math.round(item.course.price * 100),
      },
      quantity: 1,
    })),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    metadata: {
      userId: orderData.userId,
      orderData: JSON.stringify(orderData),
    },
  });

  return session;
}
```

## 🤖 AI & External Services

<div className="tech-specs">

| Service | Version | Purpose | Integration |
|---------|---------|---------|-------------|
| **Groq Cloud** | Latest | AI Quiz Generation | Llama 3.1 70B model for content analysis |
| **Google Gemini** | Latest | Chat & Recommendations | Natural language processing |
| **YouTube API** | v3 | Video Management | Video embedding, metadata |
| **Cloudinary** | Latest | Media Management | Image/video processing, CDN |

</div>

```typescript
// AI service integration
class AIQuizService {
  async generateQuiz(lessonContent: string): Promise<Question[]> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'Generate 5 multiple-choice questions based on lesson content.'
          },
          {
            role: 'user',
            content: lessonContent
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    return this.parseQuestions(data.choices[0].message.content);
  }
}
```

## 🛠️ Development Tools

### Code Quality & Formatting

<div className="tech-specs">

| Tool | Version | Purpose | Configuration |
|------|---------|---------|---------------|
| **ESLint** | 8.57.x | Code linting | TypeScript rules, React hooks |
| **Prettier** | 3.0.x | Code formatting | Consistent style, automatic formatting |
| **Husky** | 8.0.x | Git hooks | Pre-commit validation |
| **lint-staged** | 13.2.x | Staged file linting | Performance optimization |

</div>

```json
// ESLint configuration
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-console": "warn"
  },
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "parser": "@typescript-eslint/parser"
    }
  ]
}
```

### Testing Framework

<div className="tech-specs">

| Tool | Version | Purpose | Features |
|------|---------|---------|---------|
| **Jest** | 29.5.x | Unit testing | Snapshot testing, mocking, coverage |
| **React Testing Library** | 14.0.x | Component testing | User-centric testing approach |
| **Playwright** | 1.36.x | E2E testing | Cross-browser, visual regression |
| **MSW** | 1.2.x | API mocking | Service worker based mocking |

</div>

```typescript
// Jest configuration
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
```

## 📦 Build & Deployment

<div className="tech-specs">

| Tool | Version | Purpose | Features |
|------|---------|---------|---------|
| **Webpack** | 5.x (Next.js) | Module bundling | Code splitting, optimization |
| **Turbopack** | Latest | Next.js bundler | Faster builds (development) |
| **Vercel** | Platform | Deployment | Edge functions, CDN, analytics |
| **GitHub Actions** | Latest | CI/CD | Automated testing, deployment |

</div>

```yaml
# GitHub Actions workflow
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test:coverage
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

## 📊 Monitoring & Analytics

<div className="tech-specs">

| Tool | Version | Purpose | Features |
|------|---------|---------|---------|
| **Sentry** | 7.x | Error tracking | Real-time error monitoring, performance |
| **Vercel Analytics** | Latest | Web analytics | Core web vitals, user insights |
| **LogRocket** | Latest | Session replay | User behavior analysis |
| **Uptime Robot** | Service | Uptime monitoring | Availability tracking |

</div>

## 🔧 Package Management

```json
// package.json - Key dependencies
{
  "dependencies": {
    "next": "14.2.4",
    "react": "^18.3.1",
    "typescript": "^5.4.5",
    "@clerk/nextjs": "^4.29.12",
    "@prisma/client": "^5.1.1",
    "stripe": "^12.9.0",
    "zod": "^3.23.8",
    "tailwindcss": "^3.4.4",
    "@radix-ui/react-dialog": "^1.0.5"
  },
  "devDependencies": {
    "@types/node": "^20.14.8",
    "@types/react": "^18.3.3",
    "eslint": "^8.57.0",
    "prettier": "^3.0.0",
    "jest": "^29.5.0",
    "playwright": "^1.36.0"
  }
}
```

## 🎯 Technology Decision Matrix

| Category | Chosen Technology | Alternatives Considered | Decision Factors |
|----------|-------------------|-------------------------|------------------|
| **Frontend Framework** | Next.js 14 | Remix, Nuxt.js, Create React App | SSR/SSG, API routes, deployment ease |
| **Styling** | Tailwind CSS | Styled Components, Emotion, CSS Modules | Rapid development, consistency |
| **Database** | PostgreSQL | MySQL, MongoDB, Supabase | ACID compliance, JSON support |
| **ORM** | Prisma | TypeORM, Drizzle, Sequelize | Type safety, DX, migrations |
| **Authentication** | Clerk | Auth0, Firebase Auth, NextAuth | Features, pricing, integration |
| **Payments** | Stripe | PayPal, Square, Paddle | Developer experience, features |
| **Deployment** | Vercel | Netlify, Railway, AWS | Next.js optimization, edge functions |

## 📈 Performance Metrics

```typescript
// Performance monitoring configuration
const performanceConfig = {
  bundleSize: {
    maxSize: '500KB', // Main bundle
    chunks: 'async',  // Code splitting strategy
  },
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 90
  },
  webVitals: {
    lcp: 2.5,  // Largest Contentful Paint
    fid: 100,  // First Input Delay
    cls: 0.1   // Cumulative Layout Shift
  }
};
```

---

This technology stack provides a solid foundation for building a scalable, maintainable, and performant learning management system. Each technology choice is justified by specific requirements and contributes to the overall system goals.

:::tip Technology Updates
We regularly evaluate and update our technology stack to incorporate new features, security updates, and performance improvements while maintaining stability.
:::
