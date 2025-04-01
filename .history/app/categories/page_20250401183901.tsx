"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowRight } from "lucide-react";

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
        console.log("Fetching categories from /api/categories");
        const res = await fetch("/api/categories", { cache: "no-store" });
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
    router.push(`/course/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading categories...</p>
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
          <p>Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-muted/30 py-12">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Explore Our Course Categories
            </h1>
            <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Discover a wide range of topics and specializations to enhance
              your skills.
            </p>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                        {category.icon && (
                          <span className="text-xl">{category.icon}</span>
                        )}
                        {category.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCategoryClick(category.slug)}
                      >
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {/* Subcategories (Types) */}
                    {category.subcategories.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">
                          Explore Types
                        </h3>
                        <div className="grid gap-2">
                          {category.subcategories.map((subcat) => (
                            <div
                              key={subcat.id}
                              className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                              onClick={() =>
                                handleSubcategoryClick(subcat.slug)
                              }
                            >
                              <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                  src={subcat.image}
                                  alt={subcat.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-full"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{subcat.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {subcat.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sample Courses */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Popular Courses</h3>
                      {category.courses.length > 0 ? (
                        category.courses.map((course) => (
                          <div
                            key={course.id}
                            className="flex items-start gap-4 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                            onClick={() => handleCourseClick(course.slug)}
                          >
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={course.thumbnail}
                                alt={course.title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-md"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium line-clamp-1">
                                {course.title}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {course.shortDescription}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          No courses available yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
