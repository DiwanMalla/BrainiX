"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  Loader2,
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  ArrowRight,
  GraduationCap,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useClerk } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

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
  instructor: string;
  duration: string;
  studentsCount: number;
  rating: number;
  level: string;
  price: number;
  discount?: number;
  discountPrice?: number;
}

interface CourseItem {
  id: string;
  slug: string;
  title: string;
  thumbnail?: string | null;
  price: number;
  instructor: { name: string };
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useClerk();
  const { toast } = useToast();

  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState("popular");
  const [activeTab, setActiveTab] = useState("all");
  const [wishlist, setWishlist] = useState<string[]>([]); // Track wishlist course IDs

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      const res = await fetch("/api/wishlist", { cache: "no-store" });
      if (res.ok) {
        const wishlistItems: CourseItem[] = await res.json();
        setWishlist(wishlistItems.map((item) => item.id));
      } else {
        console.error("Failed to fetch wishlist:", res.status);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching category: /api/categories/${slug}`);
        const res = await fetch(`/api/categories/${slug}`, {
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
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
    fetchWishlist();

    // Refetch wishlist when window regains focus
    window.addEventListener("focus", fetchWishlist);
    return () => window.removeEventListener("focus", fetchWishlist);
  }, [slug, user]);

  const handleCourseClick = (courseSlug: string) => {
    console.log(`Navigating to course: ${courseSlug}`);
    router.push(`/courses/${courseSlug}`);
  };

  const handleSubcategoryClick = (subcategorySlug: string) => {
    console.log(`Navigating to subcategory: ${subcategorySlug}`);
    router.push(`/categories/${subcategorySlug}`);
  };

  const handleBackClick = () => {
    console.log("Navigating back to categories");
    router.push("/categories");
  };

  const toggleWishlist = async (courseId: string) => {
    if (!user) {
      toast({ title: "Please sign in to manage your wishlist" });
      router.push("/auth?tab=signin");
      return;
    }

    try {
      const isWishlisted = wishlist.includes(courseId);
      const method = isWishlisted ? "DELETE" : "POST";
      const res = await fetch("/api/wishlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) throw new Error("Failed to update wishlist");

      // Refetch the updated wishlist
      await fetchWishlist();

      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      });
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast({ title: "Error", description: "Failed to update wishlist" });
    }
  };

  const filteredCourses =
    category?.courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesSubcategory = selectedSubcategory === "all";
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "beginner" && course.level === "BEGINNER") ||
        (activeTab === "intermediate" && course.level === "INTERMEDIATE") ||
        (activeTab === "advanced" && course.level === "ADVANCED") ||
        (activeTab === "all" && course.level === "ALL_LEVELS");

      return matchesSearch && matchesSubcategory && matchesTab;
    }) || [];

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortOption) {
      case "popular":
        return b.studentsCount - a.studentsCount;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return 0; // Requires createdAt; add if needed
      default:
        return 0;
    }
  });

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
            <div className="flex gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
              <Button onClick={handleBackClick}>Back to Categories</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The category you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={handleBackClick}>Back to Categories</Button>
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
        <section className="relative">
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
          <div className="container px-4 md:px-6 relative -mt-32 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 hover:bg-background/80"
              onClick={handleBackClick}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Categories
            </Button>

            <div className="bg-card border rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {category.icon && (
                      <span className="text-2xl">{category.icon}</span>
                    )}
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {category.name}
                    </h1>
                    {category.featured && (
                      <Badge variant="secondary" className="ml-2">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-lg mb-4">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {category.courses.length} Courses
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {category.subcategories.length} Specializations
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {category.courses
                          .reduce((acc, curr) => acc + curr.studentsCount, 0)
                          .toLocaleString()}{" "}
                        Students
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() =>
                    window.scrollTo({ top: 600, behavior: "smooth" })
                  }
                >
                  Explore Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories Section */}
        {category.subcategories.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container px-4 md:px-6">
              <h2 className="text-2xl font-bold mb-6">
                Explore Specializations
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {category.subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="bg-card hover:bg-accent transition-colors border rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleSubcategoryClick(subcategory.slug)}
                  >
                    <div className="relative h-32 w-full">
                      <Image
                        src={subcategory.image}
                        alt={subcategory.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-1">
                        {subcategory.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {subcategory.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Courses Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-6">Available Courses</h2>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Select
                    value={selectedSubcategory}
                    onValueChange={setSelectedSubcategory}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Specializations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      {category.subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Course Level Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList>
                <TabsTrigger value="all">All Levels</TabsTrigger>
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Courses Grid */}
            {sortedCourses.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName !== "BUTTON") {
                        handleCourseClick(course.slug);
                      }
                    }}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-background/80 backdrop-blur-sm"
                        >
                          {course.level}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-background/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(course.id);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              wishlist.includes(course.id)
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        by{" "}
                        <span className="font-medium">{course.instructor}</span>
                      </p>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {course.shortDescription}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{course.studentsCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">
                          {course.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {course.discount ? (
                          <>
                            <span className="font-bold text-lg">
                              ${course.discountPrice?.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${course.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-lg">
                            ${course.price.toFixed(2)}
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View Course
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Courses Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? `No courses match your search for "${searchQuery}"`
                    : "There are no courses available in this category yet."}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
