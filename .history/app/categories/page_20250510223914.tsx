"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  image: string;
  featured: boolean;
  subcategories: Subcategory[];
  courses: Course[];
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching categories from /api/categories/full");
        const res = await fetch("/api/categories/full", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to fetch categories. Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Categories data:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        setCategories(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("Fetch error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (slug: string) => {
    console.log(`Navigating to category: ${slug}`);
    router.push(`/categories/${slug}`);
  };

  const handleSubcategoryClick = (slug: string) => {
    console.log(`Navigating to subcategory: ${slug}`);
    router.push(`/categories/${slug}`);
  };

  const handleCourseClick = (slug: string) => {
    console.log(`Navigating to course: ${slug}`);
    router.push(`/courses/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading categories...</p>
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
              Error Loading Categories
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Explore Our Course Categories
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Discover a wide range of topics and specializations to enhance
                your skills and advance your career.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  size="lg"
                  onClick={() =>
                    window.scrollTo({ top: 800, behavior: "smooth" })
                  }
                >
                  Browse Categories
                </Button>
                <Button size="lg" variant="outline">
                  Popular Courses
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
              Find Your Perfect Learning Path
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted/60 hover:border-primary/30"
                >
                  <div className="relative w-full h-72 overflow-hidden bg-muted ">
                    {category.image ? (
                      <Image
                        src={`/${category.slug}.png`}
                        alt={category.name}
                        fill
                        className="object-full transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted/50">
                        <BookOpen className="h-16 w-16 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-4 right-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      onClick={() => handleCategoryClick(category.slug)}
                    >
                      Explore <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                        {category.icon && (
                          <span className="text-xl">
                            <Image
                              href={category.icon}
                              alt={category.name}
                              width={24}
                              height={24}
                            />
                          </span>
                        )}
                        {category.name}
                      </CardTitle>
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Subcategories (Types) */}
                    {Array.isArray(category.subcategories) &&
                      category.subcategories.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <span className="w-1.5 h-6 bg-primary/80 rounded-full mr-2"></span>
                            Explore Types
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {category.subcategories
                              .slice(0, 4)
                              .map((subcat) => (
                                <div
                                  key={subcat.id}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded-md transition-colors"
                                  onClick={() =>
                                    handleSubcategoryClick(subcat.slug)
                                  }
                                >
                                  <div className="relative w-8 h-8 flex-shrink-0">
                                    <Image
                                      src={subcat.image}
                                      alt={subcat.name}
                                      fill
                                      className="rounded-full object-cover"
                                    />
                                  </div>
                                  <div className="overflow-hidden">
                                    <p className="font-medium text-sm truncate">
                                      {subcat.name}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            {category.subcategories.length > 4 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs justify-start"
                                onClick={() =>
                                  handleCategoryClick(category.slug)
                                }
                              >
                                +{category.subcategories.length - 4} more
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Sample Courses */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <span className="w-1.5 h-6 bg-primary/80 rounded-full mr-2"></span>
                        Popular Courses
                      </h3>
                      {Array.isArray(category.courses) &&
                      category.courses.length > 0 ? (
                        <div className="space-y-3">
                          {category.courses.slice(0, 2).map((course) => (
                            <div
                              key={course.id}
                              className="flex items-start gap-3 cursor-pointer hover:bg-muted p-2 rounded-md transition-colors"
                              onClick={() => handleCourseClick(course.slug)}
                            >
                              <div className="relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={course.thumbnail}
                                  alt={course.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-1">
                                  {course.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {course.shortDescription}
                                </p>
                              </div>
                            </div>
                          ))}
                          {category.courses.length > 2 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => handleCategoryClick(category.slug)}
                            >
                              View all {category.courses.length} courses{" "}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No courses available yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {categories.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No categories found. Check back soon!
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
