// app/courses/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db"; // You'll need to create this file
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Clock,
  Users,
  BarChart,
  Globe,
  Calendar,
  CheckCircle,
  Building,
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";

// Type definition based on your Prisma Course model
interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number | null;
  thumbnail: string;
  rating: number;
  totalStudents: number;
  duration: number; // in minutes
  level: string;
  language: string;
  instructor: { name: string; email: string };
  category: { name: string };
  learningObjectives: string[];
  topCompanies: string[];
  publishedAt: Date;
  updatedAt: Date;
}

interface CoursePageProps {
  params: {
    slug: string;
  };
}

// Server-side data fetching
async function getCourseBySlug(slug: string): Promise<Course | null> {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true, email: true } },
      category: { select: { name: true } },
    },
  });
  return course;
}

async function getRecommendedCourses(currentSlug: string): Promise<Course[]> {
  return prisma.course.findMany({
    where: {
      slug: { not: currentSlug },
      published: true,
    },
    take: 3,
    include: {
      instructor: { select: { name: true } },
    },
  });
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const recommendedCourses = await getRecommendedCourses(params.slug);

  // Convert duration from minutes to weeks (assuming 40 hours/week)
  const durationInWeeks = Math.ceil(course.duration / (60 * 40));

  // Format dates
  const lastUpdated = new Date(course.updatedAt).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-2">
                  {course.category.name}
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {course.title}
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                {course.shortDescription}
              </p>
              <div className="flex items-center space-x-4">
                <Image
                  src="/placeholder.svg" // You'll need to add instructor image to User model
                  alt={course.instructor.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Course Instructor
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-amber-500">
                  {course.rating.toFixed(1)}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(course.rating)
                          ? "fill-amber-500 text-amber-500"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({course.totalStudents.toLocaleString()} students)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {durationInWeeks} weeks
                </Badge>
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  {course.totalStudents.toLocaleString()} students
                </Badge>
                <Badge variant="secondary">
                  <BarChart className="mr-1 h-3 w-3" />
                  {course.level}
                </Badge>
                <Badge variant="secondary">
                  <Globe className="mr-1 h-3 w-3" />
                  {course.language}
                </Badge>
                <Badge variant="secondary">
                  <Calendar className="mr-1 h-3 w-3" />
                  Last updated {lastUpdated}
                </Badge>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="font-semibold"
                  >
                    Preview Course
                  </Button>
                </div>
              </div>
              <Card className="border-2 border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {course.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">
                          ${course.discountPrice.toFixed(2)}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          ${course.price.toFixed(2)}
                        </span>
                        <Badge className="ml-2">
                          Save{" "}
                          {Math.round(
                            ((course.price - course.discountPrice) /
                              course.price) *
                              100
                          )}
                          %
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold">
                        ${course.price.toFixed(2)}
                      </span>
                    )}
                    {/* Note: Wishlist functionality would need server-side implementation */}
                    <Heart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      Buy Now
                    </Button>
                    <Button className="w-full" variant="outline" size="lg">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                  {/* Rest of the card content remains similar */}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* What You'll Learn Section */}
          <section className="mt-12 bg-muted/30 p-6 rounded-lg">
            <h2 className="mb-4 text-2xl font-bold">What You'll Learn</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {course.learningObjectives.map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Note: Syllabus would need Module relation in Prisma schema */}
          {/* Add other sections as needed */}

          {/* Top Companies Section */}
          <section className="mt-12 bg-muted/30 p-6 rounded-lg">
            <h2 className="mb-4 text-2xl font-bold">
              Top Companies Trust This Course
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {course.topCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center bg-background p-4 rounded-lg shadow-sm"
                >
                  <Building className="h-6 w-6 text-primary mr-2" />
                  <span className="font-semibold">{company}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Courses Section */}
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Recommended Courses</h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
              {recommendedCourses.map((rec) => (
                <Card key={rec.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={rec.thumbnail || "/placeholder.svg"}
                      alt={rec.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg line-clamp-2">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {rec.instructor.name}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-bold">${rec.price.toFixed(2)}</span>
                      <Button size="sm" variant="outline">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
