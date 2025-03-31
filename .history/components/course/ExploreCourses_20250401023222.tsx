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
import { Switch } from "@/components/ui/switch";
import CourseCard from "@/components/Card/CourseCard";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ChatIcon from "@/components/chat/chat-icon";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { getAllCourses } from "@/lib/course-data";

// Define the Course interface
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
  duration?: number; // Added for duration filter
}

// Define filter state interface
interface Filters {
  search: string;
  category: string;
  level: string;
  priceRange: number[];
  duration: string;
  subtitles: boolean;
  certificate: boolean;
}

export default function ExploreCourses() {
  // State Management
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "all",
    level: "all",
    priceRange: [0, 200],
    duration: "any",
    subtitles: false,
    certificate: false,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const allCourses = getAllCourses();

  // Filter Courses Logic
  useEffect(() => {
    const applyFilters = () => {
      let result = [...allCourses];

      // Search Filter
      if (filters.search) {
        result = result.filter(
          (course) =>
            course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            course.shortDescription
              ?.toLowerCase()
              .includes(filters.search.toLowerCase()) ||
            course.instructor
              .toLowerCase()
              .includes(filters.search.toLowerCase()) ||
            course.category.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Category Filter
      if (filters.category !== "all") {
        result = result.filter((course) =>
          course.category.toLowerCase().includes(filters.category.toLowerCase())
        );
      }

      // Level Filter
      if (filters.level !== "all") {
        result = result.filter((course) =>
          course.level.toLowerCase().includes(filters.level.toLowerCase())
        );
      }

      // Price Range Filter
      result = result.filter(
        (course) =>
          course.price >= filters.priceRange[0] &&
          course.price <= filters.priceRange[1]
      );

      // Duration Filter
      if (filters.duration !== "any" && course.duration) {
        if (filters.duration === "short") {
          result = result.filter((course) => course.duration! <= 4);
        } else if (filters.duration === "medium") {
          result = result.filter(
            (course) => course.duration! > 4 && course.duration! <= 8
          );
        } else if (filters.duration === "long") {
          result = result.filter((course) => course.duration! > 8);
        }
      }

      // Subtitles Filter
      if (filters.subtitles) {
        result = result.filter(
          (course) => course.subtitlesLanguages?.length > 0
        );
      }

      // Certificate Filter
      if (filters.certificate) {
        result = result.filter(
          (course) => course.certificateAvailable === true
        );
      }

      setFilteredCourses(result);
    };

    applyFilters();
  }, [filters, allCourses]);

  // Handlers
  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Render Functions
  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
        Explore Courses
      </h1>
      <p className="mt-4 text-muted-foreground">
        Discover a wide range of courses to enhance your skills and advance your
        career.
      </p>
    </motion.div>
  );

  const renderSearchAndFilters = () => (
    <div className="mt-8 flex flex-col gap-4 md:flex-row">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses, instructors, or categories..."
          className="pl-8 bg-background/80 backdrop-blur-sm border-primary/20 focus:ring-primary/50"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <Select
        value={filters.category}
        onValueChange={(value) => handleFilterChange("category", value)}
      >
        <SelectTrigger className="w-full md:w-[180px] bg-background/80 backdrop-blur-sm border-primary/20">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="web-development">Web Development</SelectItem>
          <SelectItem value="data-science">Data Science</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </Select>

      {/* Level Filter */}
      <Select
        value={filters.level}
        onValueChange={(value) => handleFilterChange("level", value)}
      >
        <SelectTrigger className="w-full md:w-[180px] bg-background/80 backdrop-blur-sm border-primary/20">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>

      {/* Advanced Filters Toggle */}
      <Button
        variant="outline"
        className="w-full md:w-auto bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      >
        <Filter className="mr-2 h-4 w-4" />
        Filters
        {showAdvancedFilters ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );

  const renderAdvancedFilters = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {/* Price Range */}
      <div>
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

      {/* Duration Filter */}
      <div>
        <label className="text-sm font-medium text-foreground">Duration</label>
        <Select
          value={filters.duration}
          onValueChange={(value) => handleFilterChange("duration", value)}
        >
          <SelectTrigger className="mt-2 w-full bg-background/80 backdrop-blur-sm border-primary/20">
            <SelectValue placeholder="Any Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Duration</SelectItem>
            <SelectItem value="short">0-4 weeks</SelectItem>
            <SelectItem value="medium">5-8 weeks</SelectItem>
            <SelectItem value="long">9+ weeks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subtitles Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="subtitles"
          checked={filters.subtitles}
          onCheckedChange={(checked) =>
            handleFilterChange("subtitles", checked)
          }
        />
        <label
          htmlFor="subtitles"
          className="text-sm font-medium text-foreground"
        >
          Subtitles Available
        </label>
      </div>

      {/* Certificate Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="certificate"
          checked={filters.certificate}
          onCheckedChange={(checked) =>
            handleFilterChange("certificate", checked)
          }
        />
        <label
          htmlFor="certificate"
          className="text-sm font-medium text-foreground"
        >
          Certificate of Completion
        </label>
      </div>
    </motion.div>
  );

  const renderCourses = () => (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No courses found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
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
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
          >
            Load More Courses
          </Button>
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
          {/* Subtle Futuristic Background Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse delay-1000" />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            {renderHeader()}
            {renderSearchAndFilters()}
            {showAdvancedFilters && renderAdvancedFilters()}
          </div>
        </section>
        {renderCourses()}
      </main>
      <Footer />
      <ChatIcon />
    </div>
  );
}
