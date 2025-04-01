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
  instructor?: string;
  duration?: string;
  studentsCount?: number;
  rating?: number;
  level?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [sortOption, setSortOption] = useState("popular");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/categories/${slug}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch category details. Status: ${res.status}`
          );
        }

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Enhance courses with mock data for the design
        if (data.courses) {
          data.courses = data.courses.map((course: Course) => ({
            ...course,
            instructor: course.instructor || "Expert Instructor",
            duration:
              course.duration || `${Math.floor(Math.random() * 20) + 5} hours`,
            studentsCount:
              course.studentsCount || Math.floor(Math.random() * 10000) + 500,
            rating: course.rating || (Math.random() * 2 + 3).toFixed(1),
            level:
              course.level ||
              ["Beginner", "Intermediate", "Advanced"][
                Math.floor(Math.random() * 3)
              ],
          }));
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
  }, [slug]);

  const handleCourseClick = (courseSlug: string) => {
    router.push(`/course/${courseSlug}`);
  };

  const handleSubcategoryClick = (subcategorySlug: string) => {
    router.push(`/categories/${subcategorySlug}`);
  };

  const handleBackClick = () => {
    router.push("/categories");
  };

  const filteredCourses =
    category?.courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesSubcategory =
        selectedSubcategory === "all" ||
        category.subcategories.find((s) => s.id === selectedSubcategory)
          ?.slug === course.slug;

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "beginner" && course.level === "Beginner") ||
        (activeTab === "intermediate" && course.level === "Intermediate") ||
        (activeTab === "advanced" && course.level === "Advanced");

      return matchesSearch && matchesSubcategory && matchesTab;
    }) || [];

  // Sort courses based on selected option
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return -1; // Assuming newest would be at the top
      case "rating":
        return (
          Number.parseFloat(b.rating as string) -
          Number.parseFloat(a.rating as string)
        );
      case "popular":
        return b.studentsCount! - a.studentsCount!;
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
        {/* Hero Section with Category Details */}
        <section className="relative">
          {/* Category Banner Image */}
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <Image
              src={category.image || "/placeholder.svg?height=320&width=1920"}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          {/* Category Info */}
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
                        {Math.floor(Math.random() * 50000) + 10000} Students
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="gap-2">
                    Explore All Courses
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
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
                        src={
                          subcategory.image ||
                          "/placeholder.svg?height=128&width=256"
                        }
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
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
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
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCourseClick(course.slug)}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={
                          course.thumbnail ||
                          "/placeholder.svg?height=192&width=384"
                        }
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant="secondary"
                          className="bg-background/80 backdrop-blur-sm"
                        >
                          {course.level}
                        </Badge>
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
                          <span>{course.studentsCount?.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="border-t pt-3 flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Course
                      </Button>
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

        {/* Related Categories Section */}
        <section className="py-12 bg-muted/30">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {
                        [
                          "Web Development",
                          "Data Science",
                          "Digital Marketing",
                          "UX/UI Design",
                        ][index]
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {
                        [
                          "Master modern web technologies and frameworks.",
                          "Learn to analyze and visualize complex data.",
                          "Develop effective digital marketing strategies.",
                          "Create beautiful and functional user interfaces.",
                        ][index]
                      }
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      Explore <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
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
