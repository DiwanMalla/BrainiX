"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
  price: number;
  discount?: number;
  discountPrice?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  courses: Course[];
}

interface CategoryPageProps {
  params: { slug: string };
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching category: /api/categories/${params.slug}`);
        const res = await fetch(`/api/categories/${params.slug}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch category. Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Category data:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        setCategory(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("Fetch error:", errorMessage);
        setError(errorMessage);
        if (errorMessage === "Category not found") {
          router.push("/404");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.slug, router]);

  const handleCourseClick = (slug: string) => {
    console.log(`Navigating to course: ${slug}`);
    router.push(`/course/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading category details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-md p-6 bg-destructive/10 rounded-lg border border-destructive/20">
            <h2 className="text-xl font-semibold text-destructive mb-2">
              Error Loading Category
            </h2>
            <p className="text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return null; // Safety net, shouldn’t hit this with proper error handling
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  {category.description}
                </p>
              )}
              <Button
                size="lg"
                onClick={() =>
                  window.scrollTo({ top: 600, behavior: "smooth" })
                }
              >
                Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
              Available Courses
            </h2>

            {category.courses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.courses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted/60 hover:border-primary/30"
                    onClick={() => handleCourseClick(course.slug)}
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-4 right-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      >
                        View Course <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg line-clamp-2 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {course.shortDescription}
                      </p>
                      <div className="flex justify-between items-center">
                        {course.discount ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">
                              ${course.discountPrice?.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${course.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-lg">
                            ${course.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">
                  No courses available in this category yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
