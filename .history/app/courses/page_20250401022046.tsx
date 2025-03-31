"use client";

import { useState } from "react";
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
import { getAllCourses } from "@/lib/course-data";

export default function ExploreCourses() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const courses = getAllCourses();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Explore Courses
            </h1>
            <p className="mt-4 text-muted-foreground">
              Discover a wide range of courses to enhance your skills and
              advance your career.
            </p>
            <div className="mt-8 flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search courses" className="pl-8" />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="web-development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
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
                className="w-full md:w-auto"
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
            {showAdvancedFilters && (
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Price Range</label>
                  <Slider
                    min={0}
                    max={200}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-2"
                  />
                  <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Select>
                    <SelectTrigger className="mt-2 w-full">
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
                <div className="flex items-center space-x-2">
                  <Switch id="subtitles" />
                  <label htmlFor="subtitles" className="text-sm font-medium">
                    Subtitles Available
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="certificate" />
                  <label htmlFor="certificate" className="text-sm font-medium">
                    Certificate of Completion
                  </label>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
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
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button variant="outline" size="lg">
                Load More Courses
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatIcon />
    </div>
  );
}
