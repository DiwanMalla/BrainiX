"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import CourseCard from "@/components/Card/CourseCard";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ChatIcon from "@/components/chat/chat-icon";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";

interface Course {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  image: string;
  discount?: number;
  bestseller?: boolean;
  category: string;
  level: string;
  shortDescription?: string;
}

interface Filters {
  search: string;
  category: string;
  level: string;
  priceRange: number[];
}

export default function ExploreCourses() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    level: "all",
    priceRange: [0, 200],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(searchValue, 300);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  console.log(categories);
  useEffect(() => {
    handleFilterChange("search", debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          ...(filters.search && { search: filters.search }),
          ...(filters.category !== "all" && { category: filters.category }),
          ...(filters.level !== "all" && { level: filters.level }),
          priceRange: filters.priceRange.join(","),
          page: page.toString(),
        }).toString();

        const response = await fetch(`/api/courses/explore?${query}`);
        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);
          setCourses(data);
        } else {
          setError("Failed to load courses. Please try again.");
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("An error occurred while loading courses.");
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [filters, page]);
  console.log("Filters being applied:", filters);

  console.log(courses);
  const handleFilterChange = (key: keyof Filters, value: any) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
        Explore Courses
      </h1>
      <p className="mt-2 text-muted-foreground">
        Discover courses to boost your skills and career.
      </p>
    </motion.div>
  );

  const renderSearchAndFilters = () => (
    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses, instructors, or categories..."
          className="pl-10 bg-background/90 border-primary/10 focus:ring-primary/30 rounded-lg"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-full md:w-[180px] bg-background/90 border-primary/10">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.level}
          onValueChange={(value) => handleFilterChange("level", value)}
        >
          <SelectTrigger className="w-full md:w-[180px] bg-background/90 border-primary/10">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="bg-background/90 border-primary/10 hover:bg-primary/5"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {showFilters ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );

  const renderAdvancedFilters = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <div className="bg-background/90 p-4 rounded-lg border border-primary/10">
        <label className="text-sm font-medium text-foreground">
          Price Range
        </label>
        <Slider
          min={0}
          max={200}
          step={1}
          value={filters.priceRange}
          onValueChange={(value) => handleFilterChange("priceRange", value)}
          className="mt-2"
        />
        <div className="mt-1 flex justify-between text-sm text-muted-foreground">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>
    </motion.div>
  );

  const renderCourses = () => (
    <section className="w-full py-12 md:py-16">
      <div className="container px-4 md:px-6">
        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : isLoading && (!courses || courses.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : !courses || courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No courses found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CourseCard
                  id={course.id}
                  slug={course.slug}
                  title={course.title}
                  instructor={course.instructor}
                  rating={course.rating}
                  students={course.students}
                  price={course.price}
                  image={course.image}
                  discount={course.discount}
                  bestseller={course.bestseller}
                  category={course.category}
                  level={course.level}
                  shortDescription={course.shortDescription}
                />
              </motion.div>
            ))}
          </div>
        )}
        {page < totalPages && !error && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="bg-background/90 border-primary/10 hover:bg-primary/5"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More Courses"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-48 h-48 bg-primary/5 rounded-full filter blur-2xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-2xl animate-pulse delay-1000" />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            {renderHeader()}
            {renderSearchAndFilters()}
            {showFilters && renderAdvancedFilters()}
          </div>
        </section>
        {renderCourses()}
      </main>
      <Footer />
      <ChatIcon />
    </div>
  );
}
